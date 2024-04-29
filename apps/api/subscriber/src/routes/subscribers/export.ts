import { Router } from "express";
import { validateRequest } from "@channel360/core";
import SubscriberController from "@controllers/SubscriberController";
import { DATE_RANGE_VALIDATION } from "@validations/subscriber-validation";

const router = Router({ mergeParams: true });
router.use(DATE_RANGE_VALIDATION, validateRequest, SubscriberController.export);

export { router as exportSubscribersRouter };
