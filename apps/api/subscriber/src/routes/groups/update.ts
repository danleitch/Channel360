import express from "express";
import { validateRequest } from "@channel360/core";
import GroupController from "@controllers/GroupController";

const router = express.Router({ mergeParams: true });

router.use(validateRequest, GroupController.updateGroup);

export { router as updateGroupRouter };
