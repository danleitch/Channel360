import express, { Router } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cors from "cors";
import { indexCampaignRouter } from "@routes/campaigns/index";
import { newCampaignsRouter } from "@routes/campaigns/new";
import { deleteCampaignsRouter } from "@routes/campaigns/delete";
import { updateCampaignsRouter } from "@routes/campaigns/update";
import { showCampaignRouter } from "@routes/campaigns/show";
import { campaignsReportRouter } from "@routes/reports/campaigns";
import * as Sentry from "@sentry/node";
import {
  currentAdmin,
  currentUser,
  errorHandler,
  NotFoundError,
  validateAPIKey,
  validateCognitoTokenAndOrganization,
} from "@channel360/core";
import { exportRecipientsRouter } from "@routes/recipients/export";
import { campaignMetricsReportRouter } from "@routes/reports/campaign-metrics";
import { listCampaignResponsesRouter } from "@routes/customer-responses/list";
import { campaignResponsesExportRouter } from "@routes/customer-responses/export";
import { campaignRecipientsRouter } from "@routes/recipients/list";

const app = express();

app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

app.use(Sentry.Handlers.errorHandler());
app.use(cors({ origin: true, credentials: true }));
app.set("trust proxy", true);
app.use(json());

app.use(currentUser);
app.use(currentAdmin);

const webApiRouter = Router({ mergeParams: true });

webApiRouter.post("/reports/notifications", campaignMetricsReportRouter);
webApiRouter.get("/report", campaignsReportRouter);
webApiRouter.get("/:campaignId/recipients/export", exportRecipientsRouter);
webApiRouter.get(
  "/:campaignId/recipients/replies",
  listCampaignResponsesRouter
);
webApiRouter.get(
  "/:campaignId/recipients/replies/export",
  campaignResponsesExportRouter
);
webApiRouter.get("/:campaignId/recipients", campaignRecipientsRouter);
webApiRouter.get("/:campaignId", showCampaignRouter);
webApiRouter.put("/:campaignId", updateCampaignsRouter);
webApiRouter.delete("/:campaignId", deleteCampaignsRouter);
webApiRouter.get("", indexCampaignRouter);
webApiRouter.post("", newCampaignsRouter);

app.use(
  "/webapi/org/:orgId/campaigns",
  validateCognitoTokenAndOrganization,
  webApiRouter
);

app.use("/v1.1/org/:orgId/campaigns", validateAPIKey, webApiRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
