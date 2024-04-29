import { CustomError } from "./custom-error";

export class NatsListenerConnectionError extends CustomError {
  statusCode = 500;

  constructor(message: any) {

    super(message);

    Object.setPrototypeOf(this, NatsListenerConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
