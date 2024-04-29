import express, { Router } from "express";
import "express-async-errors";
import { json } from "body-parser";
import {
  currentAdmin,
  currentUser,
  errorHandler, httpPerformanceObserver,
  NotFoundError,
  validateAPIKey,
  validateCognitoTokenAndOrganization
} from "@channel360/core";
import { register } from "prom-client";
import cors from "cors";
import { sendNotificationRouter } from "@routes/v1.1/send-notification";
import * as Sentry from "@sentry/node";

const app = express();
app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

app.use(Sentry.Handlers.errorHandler());

/********* Record GRAFANA Metrics *************************/

app.use(httpPerformanceObserver);

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

/********************************************************/


app.use(cors({ origin: true, credentials: true }));
app.set("trust proxy", true);
app.use(json());

app.use(currentUser);
app.use(currentAdmin);

const apiRouter = Router({ mergeParams: true });

apiRouter.post("", sendNotificationRouter);

app.use(
  "/webapi/org/:orgId/notification",
  validateCognitoTokenAndOrganization,
  apiRouter,
);

app.use("/v1.1/org/:orgId/notification", validateAPIKey, apiRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
