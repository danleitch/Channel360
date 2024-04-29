import express from "express";
import { validateRequest } from "@channel360/core";
import SubscriberController from "@controllers/SubscriberController";

import multer from "multer";

const router = express.Router({ mergeParams: true });
router.use(
  multer({
    storage: multer.memoryStorage(),
  }).single("file"),
  validateRequest,
  SubscriberController.importSubscribers
);

export { router as importSubscriberRouter };
