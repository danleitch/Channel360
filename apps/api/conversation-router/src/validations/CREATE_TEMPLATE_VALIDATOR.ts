import { body } from "express-validator";

export const CREATE_TEMPLATE_VALIDATOR = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("name must be provided")
    .matches(/^[a-z0-9_](?!.*?[^a-z0-9_]).*?[a-z0-9]$/)
    .withMessage(
      "Name Format is Incorrect: The message template name can only have lowercase letters and underscores.",
    ),
  body("description")
    .not()
    .isEmpty()
    .withMessage("description must be provided"),
  body("enabled").not().isEmpty().withMessage("enabled must be provided"),
  body("namespace").not().isEmpty().withMessage("namespace must be provided"),
  body("language").not().isEmpty().withMessage("language must be provided"),
  body("category")
    .not()
    .isEmpty()
    .withMessage("category must be provided")
    .isIn(["MARKETING", "AUTHENTICATION", "UTILITY"])
    .withMessage(
      "Please select a valid category [MARKETING, AUTHENTICATION, UTILITY]",
    ),
  body("components").not().isEmpty().withMessage("components must be provided")
];
