import { CustomSuccess } from "./custom-success";
import { Response } from "express";

export class GetSuccess extends CustomSuccess {
  statusCode = 200;

  public send(data: any): Response {
    return this.res.status(this.statusCode).json(data);
  }
}
