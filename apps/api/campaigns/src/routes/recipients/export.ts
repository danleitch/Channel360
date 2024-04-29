import { Router } from "express";
import { validateRequest } from "@channel360/core";
import { REQUIRE_CAMPAIGN } from "@validations/recipient-validation";
import RecpientController from "@controllers/RecipientController";

const router = Router({ mergeParams: true });

router.use(REQUIRE_CAMPAIGN, validateRequest, RecpientController.export);

export { router as exportRecipientsRouter };
