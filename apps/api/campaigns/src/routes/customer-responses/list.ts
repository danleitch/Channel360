import { Router } from "express";
import { validateRequest } from "@channel360/core";
import CampaignResponseController from "@controllers/CampaignResponsesController";

const router = Router({ mergeParams: true });

router.use(validateRequest, CampaignResponseController.list);

export { router as listCampaignResponsesRouter };
