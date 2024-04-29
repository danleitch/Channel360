import express from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const validateCognitoToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "No token provided." });
  }
  // Verifier that expects valid access tokens:
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env["AWS_COGNITO_POOL_ID"]!,
    tokenUse: "access",
    clientId: process.env["AWS_COGNITO_CLIENT_ID"]!,
  });

  try {
    const decodedToken = await verifier.verify(token);
    const userGroups = decodedToken["cognito:groups"];
    if (userGroups) {
      req.userGroups = userGroups;
    }
    next();
  } catch {
    throw new NotAuthorizedError();
  }
};
