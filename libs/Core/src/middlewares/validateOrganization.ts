import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import jwt from "jsonwebtoken";

export const validateOrganization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orgId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new NotAuthorizedError();
  }

  const decoded = jwt.decode(token);
  // @ts-ignore
  if (!decoded || decoded["id"] !== orgId) {
    return res
      .status(403)
      .json({ message: "Organization ID does not match token." });
  }

  next();
};
