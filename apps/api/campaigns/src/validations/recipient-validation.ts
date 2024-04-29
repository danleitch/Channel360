import { param } from "express-validator";
export const REQUIRE_CAMPAIGN = [
  param("campaignId")
    .not()
    .isEmpty()
    .withMessage("campaignId must be provided"),
];
