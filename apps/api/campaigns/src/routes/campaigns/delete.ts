import express from "express";
import { validateRequest } from "@channel360/core";
import { CampaignController } from "@controllers/CampaignController";

const router = express.Router({ mergeParams: true });

router.use(validateRequest, new CampaignController().delete);

export { router as deleteCampaignsRouter };
