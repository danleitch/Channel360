import express, { Request, Response } from "express";
import { BadRequestError, ModelFinder, SmoochAPI } from "@channel360/core";
import { natsWrapper } from "../../nats-wrapper";
import { Organization } from "@models/organization";
import { SmoochApp } from "@models/smoochApp";
import { IntegrationService, WebhooksService } from "@services/index";
import { SmoochAppCreatedPublisher } from "@publishers/smooch-app-created-publisher";

const router = express.Router({ mergeParams: true });

router.use(async (req: Request, res: Response) => {
  const { orgId, appId } = req.params;

  const organization = await ModelFinder.findByIdOrFail(
    Organization,
    orgId,
    "Organization Not Found",
  );

  const smoochApp = await SmoochApp.findOne({ appId });

  if (smoochApp && smoochApp.organization) {
    throw new BadRequestError("Smooch App already assigned to an organization");
  } else if (smoochApp) {
    smoochApp.organization = orgId;

    smoochApp.save();

    return res.status(200).send(smoochApp);
  }

  // Fetching the app from smooch
  const smoochApiClient = new SmoochAPI(appId);

  const { data } = await smoochApiClient.makeGetRequest<{ data: any }>("");

  const { app } = data;

  const BASE_URL = req.protocol + "://" + req.get("host");

  // Send Requests to Add Webhooks
  await new WebhooksService(
    smoochApiClient,
    organization.id,
    BASE_URL,
  ).addWebhooks();

  // Send Requests to Refresh Integrations
  const integrations = await new IntegrationService(
    smoochApiClient,
  ).refreshIntegrations();

  const newSmoochApp = SmoochApp.build({
    appId: app._id,
    name: app.name,
    organization: organization.id,
    appToken: app.appToken,
    settings: app.settings,
    metadata: app.metadata || {},
  });

  newSmoochApp.integrationId = integrations.find((integration: any) => {
    return integration.type === "whatsapp";
  })._id;

  await newSmoochApp.save();

  await new SmoochAppCreatedPublisher(natsWrapper.client).publish({
    id: newSmoochApp.id,
    organization: newSmoochApp.organization?.toString(),
    appId: newSmoochApp.appId,
    name: newSmoochApp.name,
    integrationId: newSmoochApp.integrationId,
  });

  res.status(201).send(newSmoochApp);
});

export { router as assignSmoochAppRouter };
