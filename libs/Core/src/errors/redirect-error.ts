import { CustomError } from './custom-error';

export class RedirectError extends CustomError {
  statusCode = 403;

  constructor(public message: string, public location: string) {
    super(message);

    Object.setPrototypeOf(this, RedirectError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
