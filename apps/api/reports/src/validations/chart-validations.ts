import { body, query } from "express-validator";
import { BadRequestError } from "@channel360/core";

export const CREATE_CHART_VALIDATION = [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("strategyKey").not().isEmpty().withMessage("strategyKey is required"),
  body("type").not().isEmpty().withMessage("type is required"),
];
export const UPDATE_CHART_VALIDATION = [
  body("title")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Title must have a value"),
  body("description")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Description must have a value"),
  body("strategyKey")
    .optional()
    .not()
    .isEmpty()
    .withMessage("strategyKey must have a value"),
  body("keyLabel")
    .optional()
    .not()
    .isEmpty()
    .withMessage("keyLabel must have a value"),
  body("type").optional().not().isEmpty().withMessage("type must have a value"),
];

export const GET_CHART_VALIDATION = [
  query("startDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("startDate must be a valid date in YYYY-MM-DD format"),
  query("endDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("endDate must be a valid date in YYYY-MM-DD format"),
  query("endDate").custom((value, { req }) => {

    if (!req.query) return true;

    if (req.query.startDate && value) {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(value);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 92) {
        throw new BadRequestError(
          "startDate and endDate must be a maximum of 3 months apart",
        );
      }
    }

    return true;
  }),
];
