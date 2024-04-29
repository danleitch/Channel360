import { Router } from "express";
import { validateRequest } from "@channel360/core";
import ApiController from "@controllers/ApiController";
import { REQUIRE_ORGANIZATION } from "@validations/token-validation";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /v1.1/organization/{orgId}/token:
 *  post:
 *  - Organization
 *  summary: Request a apiKey for an organization
 */
router.use(
  REQUIRE_ORGANIZATION,
  validateRequest,
  ApiController.create
);

export { router as createApiKeyRouter };
