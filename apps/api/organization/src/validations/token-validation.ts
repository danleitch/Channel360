import { param } from "express-validator";

export const REQUIRE_ORGANIZATION = [
  param("orgId").notEmpty().withMessage("orgId must be valid"),
];
