import { Router } from "express";
import OrganizationController from "@controllers/OrganizationController";

const router = Router({ mergeParams: true });
router.use(OrganizationController.update);

export { router as updateOrganizationRouter };
