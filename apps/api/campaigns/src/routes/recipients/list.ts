import express from "express";
import { validateRequest } from "@channel360/core";
import RecpientController from "@controllers/RecipientController";

const router = express.Router({ mergeParams: true });

router.use(validateRequest, RecpientController.list);

export { router as campaignRecipientsRouter };
