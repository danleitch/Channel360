import { Router } from "express";
import OrganizationController from "@controllers/OrganizationController";

const router = Router({ mergeParams: true });
router.use(OrganizationController.get);

export { router as getOrganizationRouter };
