import {
  errorHandler,
  NotFoundError, requireAdminGroup, validateCognitoToken,
  validateCognitoTokenAndOrganization
} from "@channel360/core";
import cors from "cors";
import "express-async-errors";
import express from "express";
import { json } from "body-parser";
import webApiAdminRouter from "@routes/webapi/chart/admin";
import webApiRouter from "@routes/webapi/chart";
import { webApiReportsRouter } from "@routes/legacy";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.set("trust proxy", true);
app.use(json());


app.use(
  "/webapi/admin/charts",
  validateCognitoToken,
  requireAdminGroup,
  webApiAdminRouter,
);

app.use(
  "/webapi/org/:orgId/charts",
  validateCognitoTokenAndOrganization,
  webApiRouter,
);

app.use(
  "/webapi/org/:orgId/reports",
  validateCognitoTokenAndOrganization,
  webApiReportsRouter,
);

app.all("*", async (_req, _res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
