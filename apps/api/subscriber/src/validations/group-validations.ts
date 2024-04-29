import { body } from "express-validator";

export const CREATE_GROUP_VALIDATIONS = [
  body("name").not().isEmpty().withMessage("name must be provided"),
  body("description")
    .not()
    .isEmpty()
    .withMessage("description must be provided"),
];

export const ASSIGN_TO_GROUP_VALIDATION = [
  body("subscriberIds")
    .not()
    .isEmpty()
    .withMessage("subscriberIds must be provided"),
  body("groupId").not().isEmpty().withMessage("groupId must be provided"),
];
export const VALIDATE_UNASSIGN = [
  body("subscriberIds")
    .not()
    .isEmpty()
    .withMessage("subscriberIds must be provided"),
  body("groupId").not().isEmpty().withMessage("groupId must be provided"),
];
