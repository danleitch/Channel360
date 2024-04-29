import { Router } from "express";
import { validateRequest } from "@channel360/core";
import { CampaignController } from "@controllers/CampaignController";

const router = Router({ mergeParams: true });

router.use(validateRequest, new CampaignController().list);

export { router as indexCampaignRouter };
