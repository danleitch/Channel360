import { body, query } from "express-validator";

export const CREATE_SUBSCRIBER_VALIDATION = [
  body("mobileNumber")
    .not()
    .isEmpty()
    .withMessage("mobileNumber must be provided"),
  body("firstName").not().isEmpty().withMessage("firstName must be provided"),
  body("lastName").not().isEmpty().withMessage("lastName must be provided"),
];

export const BATCH_SUBSCRIBER_VALIDATION = [
  body("subscriberIds")
    .not()
    .isEmpty()
    .withMessage("subscriberIds must be provided"),
];
export const DATE_RANGE_VALIDATION = [
  query("startDate").notEmpty().withMessage("startDate must be provided"),
  query("endDate").notEmpty().withMessage("endDate must be provided"),
];
