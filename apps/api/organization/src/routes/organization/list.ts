import { Router } from "express";
import OrganizationController from "@controllers/OrganizationController";

const router = Router({ mergeParams: true });
router.use(OrganizationController.list);

export { router as listOrganizationRouter };
