import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import jwt from "jsonwebtoken";

/**
 * @deprecated
 * @param req
 * @param _res
 * @param next
 */
export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token");
      throw new NotAuthorizedError();
    }
    // Verify the token with both JWT_KEY and ADMIN_JWT_KEY.
    console.log("JWT, ", jwt.verify(token, process.env.JWT_KEY!));
    jwt.verify(token, process.env.JWT_KEY!);
    next();
  } catch (err) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.log("No token");
        throw new NotAuthorizedError();
      }
      jwt.verify(token, process.env.ADMIN_JWT_KEY!);
      next();
    } catch (error) {
      throw new NotAuthorizedError();
    }
  }
};
