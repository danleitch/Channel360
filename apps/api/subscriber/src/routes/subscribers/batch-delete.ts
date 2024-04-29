import { Router } from "express";
import { validateRequest } from "@channel360/core";
import { BATCH_SUBSCRIBER_VALIDATION } from "@validations/subscriber-validation";
import SubscriberController from "@controllers/SubscriberController";

const router = Router({ mergeParams: true });
router.use(
  validateRequest,
  BATCH_SUBSCRIBER_VALIDATION,
  SubscriberController.batchDelete
);

export { router as batchDeleteSubscriberRouter };
