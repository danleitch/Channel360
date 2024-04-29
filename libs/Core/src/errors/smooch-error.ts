import { CustomError } from "./custom-error";

export interface ISmoochError {
  code: string;
  description: string;
}

export class SmoochError extends CustomError {
  statusCode = 400;

  constructor(public error: ISmoochError) {
    super(error.description);
    console.error("SMOOCH ERROR", error);
    Object.setPrototypeOf(this, SmoochError.prototype);
  }

  serializeErrors() {
    return [{ message: this.error.description }];
  }
}
