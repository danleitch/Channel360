import { Router } from "express";
import OrganizationController from "@controllers/OrganizationController";

const router = Router({ mergeParams: true });
router.use(OrganizationController.delete);

export { router as deleteOrganizationRouter };
