import express from "express";
import { validateRequest } from "@channel360/core";
import { ASSIGN_TO_GROUP_VALIDATION } from "@validations/group-validations";
import GroupSubscriberController from "@controllers/GroupSubscriberController";

const router = express.Router({ mergeParams: true });
router.use(
  ASSIGN_TO_GROUP_VALIDATION,
  validateRequest,
  GroupSubscriberController.assignSubscriberToGroup
);

export { router as assignSubscriberGroupRouter };
