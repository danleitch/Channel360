import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors
      .map((err) => {
        if (err.type === "alternative") {
          console.log(
            `There are ${err.nestedErrors.length} errors under this alternative list`,
          );
          // Optionally handle alternative errors here if needed
          // For example, you might want to flatten these errors into the same structure
          return undefined; // Explicitly return undefined for clarity
        } else if (err.type === "field") {
          return { message: err.msg, field: err.path };
        }
        return undefined; // Ensure all non-handled cases explicitly return undefined
      })
      .filter((error): error is { message: string; field: string } => error !== undefined); // Filter out undefined values
  }
}
