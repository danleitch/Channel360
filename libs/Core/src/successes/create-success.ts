import { CustomSuccess } from "./custom-success";
import { Response } from "express";

export class CreateSuccess extends CustomSuccess {
  statusCode = 201;

  public send(message?: string, data?: any): Response {
    const responseObj: any = {};

    if (message != undefined) {
      responseObj.message = message;
    }
    if (data !== undefined) {
      responseObj.data = data;
    }

    return this.res.status(this.statusCode).json(responseObj);
  }
}
