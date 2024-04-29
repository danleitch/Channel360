

import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";


/**
 * Require admin middleware
 * This middleware is used to check if the user is an admin for the v1.1 API
 * @param req
 * @param res
 * @param next
 */
export const requireAdminGroup = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const userGroups = req.userGroups;

  if (!userGroups || !userGroups.includes("Admin")) {
    throw new NotAuthorizedError();
  }

  next();
};
