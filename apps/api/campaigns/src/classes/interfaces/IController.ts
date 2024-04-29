import { Request, Response } from "express";

export interface IController<T> {
  list(req: Request, res: Response): Promise<Response<T>>;

  get(req: Request, res: Response): Promise<Response<T>>;

  create(req: Request, res: Response): Promise<Response<T>>;

  update(req: Request, res: Response): Promise<Response>;

  delete(req: Request, res: Response): Promise<Response>;
}
