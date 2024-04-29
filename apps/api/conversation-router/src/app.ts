import {
  currentUser,
  errorHandler,
  NotFoundError, requireAdminGroup,
  requireAuth,
  requireOrg, requireSuperAdmin,
  validateAPIKey, validateCognitoToken,
  validateCognitoTokenAndOrganization
} from "@channel360/core";
import { json } from "body-parser";
import express, { Router } from "express";
import "express-async-errors";
import cors from "cors";
import { reportMessagesRouter } from "./routes/admin/report-messages";
import { conversationHistoryRouter } from "./routes/conversation-history";
import { newTemplatesRouter } from "./routes/create-template";
import { refreshIntegrationsRouter } from "./routes/refresh";
import { replyRouter } from "./routes/reply";
import { assignSmoochAppRouter } from "./routes/smoochApp/assign";
import { showSmoochAppRouter } from "./routes/smoochApp/show";
import { unassignSmoochAppRouter } from "./routes/smoochApp/unassign";
import * as Sentry from "@sentry/node";
import { getSmoochAppByOrgIdRouter } from "@routes/smoochApp/by-orgId";
import { Organization } from "@models/organization";

const app = express();
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// the rest of your app

app.use(Sentry.Handlers.errorHandler());
app.use(cors({ origin: true, credentials: true }));
app.set("trust proxy", true);
app.use(json());

app.use(currentUser);


/**
 * API Routes
 */

const apiRouter = Router({ mergeParams: true });

apiRouter.post(
  "/reply/:orgId/appuser/:authorId/messages",
  requireOrg(Organization),
  replyRouter
);
apiRouter.get(
  "/conversation/history/:orgId/subscriber/:destinationId",
  conversationHistoryRouter
);

apiRouter.get("/smooch/organization/:orgId", getSmoochAppByOrgIdRouter);

apiRouter.post("/refresh/:orgId", refreshIntegrationsRouter);
apiRouter.post("/reports/messages", reportMessagesRouter);
apiRouter.post("/create-template/:orgId", newTemplatesRouter);

app.use("/api", requireAuth, apiRouter);

const adminApiRouter = Router({ mergeParams: true });

adminApiRouter.post("/smooch/:orgId", assignSmoochAppRouter);
adminApiRouter.delete("/smooch/:orgId/:appId", unassignSmoochAppRouter);
adminApiRouter.get("/smooch/:id", showSmoochAppRouter);

app.use("/api", requireSuperAdmin, adminApiRouter);


const webApiAdminRouter = Router({ mergeParams: true });

webApiAdminRouter.delete("/:appId", unassignSmoochAppRouter);
webApiAdminRouter.post("/:appId", assignSmoochAppRouter);
webApiAdminRouter.get("/:id", showSmoochAppRouter);
webApiAdminRouter.get("", getSmoochAppByOrgIdRouter);

app.use(
  "/webapi/org/:orgId/whatsapp/smooch",
  validateCognitoToken,
  requireAdminGroup,
  webApiAdminRouter
);

const webApiRouter = Router({ mergeParams: true });

webApiRouter.post("/appuser/:authorId/reply", replyRouter);
webApiRouter.get(
  "/subscriber/:destinationId/conversation/history",
  conversationHistoryRouter
);
webApiRouter.post("/templates/refresh", refreshIntegrationsRouter);
webApiRouter.post("/reports/messages", reportMessagesRouter);
webApiRouter.post("/templates", newTemplatesRouter);

app.use(
  "/webapi/org/:orgId/whatsapp",
  validateCognitoTokenAndOrganization,
  webApiRouter
);



app.use("/v1.1/org/:orgId/whatsapp", validateAPIKey, webApiRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
