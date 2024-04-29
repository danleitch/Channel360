import { Router } from "express";
import { validateRequest } from "@channel360/core";
import SubscriberController from "@controllers/SubscriberController";

const router = Router({ mergeParams: true });

router.use(validateRequest, SubscriberController.create);

export { router as newSubscriberRouter };
