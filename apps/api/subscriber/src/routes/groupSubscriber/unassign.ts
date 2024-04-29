import express from "express";
import { VALIDATE_UNASSIGN } from "@validations/group-validations";
import { validateCognitoToken, validateRequest } from "@channel360/core";
import GroupSubscriberController from "@controllers/GroupSubscriberController";

const router = express.Router({ mergeParams: true });

router.use(
  VALIDATE_UNASSIGN,
  validateRequest,
  validateCognitoToken,
  GroupSubscriberController.unAssignSubscriberFromGroup
);

export { router as unassignSubscriberGroupRouter };
