import { Router } from "express";
import { validateRequest } from "@channel360/core";
import CampaignResponsesController from "@controllers/CampaignResponsesController";

const router = Router({ mergeParams: true });

router.use(validateRequest, CampaignResponsesController.export);

export { router as campaignResponsesExportRouter };
