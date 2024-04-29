import express from "express";
import { validateRequest } from "@channel360/core";
import SubscriberController from "@controllers/SubscriberController";

const router = express.Router({ mergeParams: true });

router.use(validateRequest, SubscriberController.update);

export { router as updateSubscriberRouter };
