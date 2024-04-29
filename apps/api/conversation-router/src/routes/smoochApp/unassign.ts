import express, { Request, Response } from "express";
import { BadRequestError, ModelFinder } from "@channel360/core";
import { Organization } from "@models/organization";
import { SmoochApp } from "@models/smoochApp";
import { SmoochAppDeletedPublisher } from "@publishers/smooch-app-deleted-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router({ mergeParams: true });

router.use(async (req: Request, res: Response) => {
  const organization = await ModelFinder.findByIdOrFail(
    Organization,
    req.params.orgId,
    "Organization Not Found"
  );
  // if Smooch App exists and has no organizationId, then update Smooch App with Organization id.
  const smoochApp = await ModelFinder.findOneOrFail(
    SmoochApp,
    { appId: req.params.appId },
    "Smooch App Not Found"
  );

  // Validate if SmoochApp is a assigned to another organization
  if (
    smoochApp.organization &&
    smoochApp.organization.toString() != organization.id.toString()
  ) {
    throw new BadRequestError(
      "Smooch App already assigned to another organization"
    );
  }

  // delete Smooch App
  await SmoochApp.findByIdAndDelete(smoochApp.id);

  await new SmoochAppDeletedPublisher(natsWrapper.client).publish({
    appId: smoochApp.appId,
    organization: smoochApp.organization!,
  });

  res.status(202).send({ message: "Smooch App has been unassigned" });
});

export { router as unassignSmoochAppRouter };
