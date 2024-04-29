import { Document, Model } from "mongoose";
import { BadRequestError } from "../errors/bad-request-error";

export class ModelFinder {
  static async findByIdOrFail<T extends Document>(
    model: Model<T>,
    id: string,
    errorMessage: string
  ): Promise<T> {
    const document = await model.findById(id);

    if (!document) {
      throw new BadRequestError(errorMessage);
    }

    return document;
  }

  static async findOneOrFail<T extends Document>(
    model: Model<T>,
    options: any,
    errorMessage: string
  ): Promise<T> {
    const document = await model.findOne(options);

    if (!document) {
      throw new BadRequestError(errorMessage);
    }

    return document;
  }

}
