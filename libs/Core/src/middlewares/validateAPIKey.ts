import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import jwt from "jsonwebtoken";

export const validateAPIKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orgId } = req.params; // Assuming orgId is a URL parameter
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new NotAuthorizedError();
  }

  try {
    const decoded = jwt.verify(token, process.env["JWT_KEY"]!);

    if (
      typeof decoded === "object" &&
      "id" in decoded &&
      decoded["id"] === orgId
    ) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Organization ID does not match token." });
    }
  } catch (error) {
    throw new NotAuthorizedError();
  }
};
