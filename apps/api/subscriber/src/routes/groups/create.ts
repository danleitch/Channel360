import express from "express";
import { validateRequest } from "@channel360/core";
import GroupController from "@controllers/GroupController";
import { CREATE_GROUP_VALIDATIONS } from "@validations/group-validations";

const router = express.Router({ mergeParams: true });
router.use(
  CREATE_GROUP_VALIDATIONS,
  validateRequest,
  GroupController.createGroup
);

export { router as newGroupRouter };
