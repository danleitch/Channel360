import { CustomError } from './custom-error';

export class MessageFailedError extends CustomError {
  statusCode = 500;

  constructor(public reason: string) {
    super(reason);

    Object.setPrototypeOf(this, MessageFailedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
