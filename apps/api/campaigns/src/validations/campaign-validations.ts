import { body } from "express-validator";

//limit scheduled date to 10 minutes in the past
const tenMinutesBeforeNow = new Date();

tenMinutesBeforeNow.setMinutes(tenMinutesBeforeNow.getMinutes() - 10);

export const CREATE_CAMPAIGN_VALIDATION = [
  body("reference").not().isEmpty().withMessage("reference must be provided"),
  body("template").not().isEmpty().withMessage("template must be provided"),
  body("status").not().isEmpty().withMessage("status must be provided"),
  body("scheduled")
    .not()
    .isEmpty()
    .withMessage("scheduled date must be provided")
    .isAfter(tenMinutesBeforeNow.toISOString())
    .withMessage("Scheduled date must be within the last 10 minutes"),
  body("subscriberGroup")
    .not()
    .isEmpty()
    .withMessage("subscriber group must be provided"),
  body("color")
    .optional()
    .matches(/^#([0-9A-F]{3}){1,2}$/i)
    .withMessage(
      "Invalid color format. Please provide a valid hexadecimal color code."
    ),
];
