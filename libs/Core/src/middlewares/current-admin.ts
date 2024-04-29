import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AdminPayload {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentAdmin?: AdminPayload;
    }
  }
}

export const currentAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next();
  }

  try {
    req.currentAdmin = jwt.verify(
      token,
      process.env.ADMIN_JWT_KEY!
    ) as AdminPayload;
  } catch (err) {}
  next();
};
