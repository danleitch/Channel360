import express from "express";
import { validateRequest } from "@channel360/core";
import GroupSubscriberController from "@controllers/GroupSubscriberController";

const router = express.Router({ mergeParams: true });
router.use(validateRequest, GroupSubscriberController.listGroupSubscribers);

export { router as getGroupSubscribers };
