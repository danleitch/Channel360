import { Request, Response, Router } from "express";
import { SmoochApp } from "@models/smoochApp";
import { BadRequestError } from "@channel360/core";

const router = Router({ mergeParams: true});

router.use(async (req: Request, res: Response) => {
  const smoochApp = await SmoochApp.findOne({
    organization: req.params.orgId,
  });

  if (!smoochApp) {
    throw new BadRequestError("SmoochApp not found");
  }
  res.send(smoochApp);
});

export { router as getSmoochAppByOrgIdRouter };