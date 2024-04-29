import { body } from "express-validator";

const validateMessageSchema = [
  body("destination").not().isEmpty().withMessage("Destination is required"),
  body("message").not().isEmpty().withMessage("Message must be provided"),
  body("message").custom((value) => {
    if (
      typeof value !== "object" ||
      Array.isArray(value) ||
      Object.keys(value).length === 0
    ) {
      throw new Error("Message must be a non-empty object");
    }

    if (value.type !== "template") {
      throw new Error('Message type must be "template"');
    }

    const { template } = value;
    if (!template || typeof template !== "object" || !template.name) {
      throw new Error("Template name is required");
    }

    if (
      !template.language ||
      typeof template.language !== "object" ||
      !template.language.policy ||
      !template.language.code
    ) {
      throw new Error("Template language policy and code must be provided");
    }

    if (!Array.isArray(template.components)) {
      throw new Error("Template components must be an array");
    }

    return true;
  }),
];

export default validateMessageSchema;
