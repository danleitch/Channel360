import express from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const validateCognitoTokenAndOrganization = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new NotAuthorizedError();
  }

  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env["AWS_COGNITO_POOL_ID"]!,
    tokenUse: "access",
    clientId: process.env["AWS_COGNITO_CLIENT_ID"]!,
  });

  try {
    const decodedToken = await verifier.verify(token);
    const userGroups = decodedToken["cognito:groups"];

    const orgId = req.params.orgId;

    if (!userGroups || !userGroups.includes(orgId)) {
      res.status(403).send({ error: "Not authorized" });
    }

    req.userGroups = userGroups;
    req.user = decodedToken["username"];

    next();
  } catch (error) {
    console.error("Error validating token:", error);
    throw new NotAuthorizedError();
  }
};

declare global {
  namespace Express {
    interface Request {
      userGroups?: string[];
      user?: string;
    }
  }
}
