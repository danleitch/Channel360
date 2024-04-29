import { Response } from "express";

export abstract class CustomSuccess {
  protected abstract statusCode: number;

  constructor(protected res: Response) {}

  abstract send(data?:any, message?:string):Response
}
