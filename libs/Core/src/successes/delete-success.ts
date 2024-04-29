import { CustomSuccess } from "./custom-success";

export class DeleteSuccess extends CustomSuccess {
  statusCode = 204;

  public send(message: string = "Delete was successful") {
    return this.res.status(this.statusCode).json({ message });
  }
}
