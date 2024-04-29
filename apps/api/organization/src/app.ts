import cors from "cors";
import {
  errorHandler,
  NotFoundError,
  requireAdminGroup,
  validateAPIKey,
  validateCognitoToken,
  validateCognitoTokenAndOrganization,
} from "@channel360/core";
import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import * as Sentry from "@sentry/node";
import webapiAdminRouter from "@routes/webapiAdminRouter";
import webapiRouter from "@routes/webapi";
import userApiRouter from "@routes/userRouter";

const app = express();
app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

app.use(Sentry.Handlers.errorHandler());
app.use(cors({ origin: true, credentials: true }));
app.use(json());

app.use(
  "/webapi/org/:orgId",
  validateCognitoTokenAndOrganization,
  webapiRouter,
);

app.use("/v1.1/org/:orgId", validateAPIKey, webapiRouter);

app.use(
  "/webapi/admin/organization",
  validateCognitoToken,
  requireAdminGroup,
  webapiAdminRouter,
);

app.use("/webapi/users/:userId", validateCognitoToken, userApiRouter);
app.use("/v1.1/users/:userId", validateAPIKey, userApiRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
