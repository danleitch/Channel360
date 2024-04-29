import { body } from "express-validator";
import { Router } from "express";
import { validateRequest } from "@channel360/core";
import OrganizationController from "@controllers/OrganizationController";

const router = Router({ mergeParams: true });
router.use(
  [
    body("name").not().isEmpty().withMessage("Name must be provided"),
    body("planId").not().isEmpty().withMessage("planId must be provided"),
  ],
  validateRequest,
  OrganizationController.create,
);

export { router as newOrganizationRouter };
