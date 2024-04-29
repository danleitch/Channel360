import express, { Router } from "express";
import "express-async-errors";
import { json } from "body-parser";
import {
  currentAdmin,
  currentUser,
  errorHandler, httpPerformanceObserver,
  NotFoundError,
  requireAuth,
  requireOrg,
  validateAPIKey,
  validateCognitoTokenAndOrganization
} from "@channel360/core";

import cors from "cors";
import { smoochWebhooksRouter } from "@routes/services";
import { createWebhookRouter } from "@routes/new";
import { deleteWebhookRouter } from "@routes/delete";
import { showWebhooksRouter } from "@routes/show";
import { Organization } from "@models/organization";
import { register } from "prom-client";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.set("trust proxy", true);
app.use(json());
app.use(currentUser);
app.use(currentAdmin);


/********* Record GRAFANA Metrics *************************/

app.use(httpPerformanceObserver);

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

/********************************************************/


const apiRouter = Router({ mergeParams: true });
apiRouter.post("", smoochWebhooksRouter);

const apiWebhookRouter = Router({ mergeParams: true });
apiWebhookRouter.delete("/:webhookId", deleteWebhookRouter);
apiWebhookRouter.post("", createWebhookRouter);
apiWebhookRouter.get("", showWebhooksRouter);

const webapiRouter = Router({ mergeParams: true });
webapiRouter.delete("/:webhookId", deleteWebhookRouter);
webapiRouter.post("", createWebhookRouter);
webapiRouter.get("", showWebhooksRouter);

app.use("/api/services/:orgId", apiRouter);

app.use(
  "/api/webhooks/:orgId",
  requireAuth,
  requireOrg(Organization),
  apiWebhookRouter,
);

app.use(
  "/webapi/org/:orgId/webhooks",
  validateCognitoTokenAndOrganization,
  webapiRouter,
);

app.use("/v1.1/org/:orgId/webhooks", validateAPIKey, webapiRouter);

app.all("*", async (_req, _res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
