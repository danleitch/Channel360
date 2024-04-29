import * as Sentry from "@sentry/node";

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
    Sentry.captureException(this);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
