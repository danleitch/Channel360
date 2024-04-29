import multer from "multer";
import express from "express";
import { validateRequest } from "@channel360/core";
import GroupSubscriberController from "@controllers/GroupSubscriberController";

const router = express.Router({ mergeParams: true });
router.use(
  multer({ storage: multer.memoryStorage() }).single("file"),
  validateRequest,
  GroupSubscriberController.importSubscribersToGroup
);

export { router as importSubscriberToGroupRouter };
