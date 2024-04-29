import { validateRequest } from "@channel360/core";
import express from "express";
import { CREATE_CAMPAIGN_VALIDATION } from "@validations/campaign-validations";
import { CampaignController } from "@controllers/CampaignController";

const router = express.Router({ mergeParams: true });

router.use(
  CREATE_CAMPAIGN_VALIDATION,
  validateRequest,
  new CampaignController().create
);

export { router as newCampaignsRouter };
