import { Request, Response, NextFunction } from "express";
export interface IRouterController {
  create(req: Request, res: Response, next: NextFunction): void;
  get(req: Request, res: Response, next: NextFunction): void;
  list(req: Request, res: Response, next: NextFunction): void;
  update(req: Request, res: Response, next: NextFunction): void;
  delete(req: Request, res: Response, next: NextFunction): void;
}