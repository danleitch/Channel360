import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import jwt from "jsonwebtoken";

export const requireSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new NotAuthorizedError();
  }
  try {
    jwt.verify(token, process.env.ADMIN_JWT_KEY!);
    next()
  } catch (err) {
    throw new NotAuthorizedError();
  }
};

