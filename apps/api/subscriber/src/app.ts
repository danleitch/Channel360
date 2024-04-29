import cors from "cors";
import "express-async-errors";
import { json } from "body-parser";
import * as Sentry from "@sentry/node";
import express, { Router, urlencoded } from "express";
import { newSubscriberRouter } from "@routes/subscribers/new";
import { showSubsciberRouter } from "@routes/subscribers/show";
import { indexSubsciberRouter } from "@routes/subscribers/list";
import { showGroupRouter } from "@routes/groups/list";
import { deleteSubscriberRouter } from "@routes/subscribers/delete";
import { importSubscriberRouter } from "@routes/import";
import { updateSubscriberRouter } from "@routes/subscribers/update";
import { exportSubscribersRouter } from "@routes/subscribers/export";
import { newGroupRouter } from "@routes/groups/create";
import { updateGroupRouter } from "@routes/groups/update";
import { deleteGroupRouter } from "@routes/groups/delete";
import { subscriberReportRouter } from "@routes/reports/metrics";
import { assignSubscriberGroupRouter } from "@routes/groupSubscriber/assign";
import { unassignSubscriberGroupRouter } from "@routes/groupSubscriber/unassign";
import {
  currentUser,
  errorHandler,
  NotFoundError,
  validateAPIKey,
  validateCognitoTokenAndOrganization,
} from "@channel360/core";
import { batchDeleteSubscriberRouter } from "@routes/subscribers/batch-delete";
import { getGroup } from "@routes/groups/group";
import { importSubscriberToGroupRouter } from "@routes/import-to-group";
import { listGroupsBySubscriberId } from "@routes/groupSubscriber/listGroupsBySubscriberId";
import { getGroupSubscribers } from "@routes/groupSubscriber/listGroupSubscribers";

const app = express();
app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

app.use(Sentry.Handlers.errorHandler());
app.use(cors({ origin: true, credentials: true }));
app.set("trust proxy", true);
app.use(json());
app.use(urlencoded({ extended: true, limit: "50mb" }));
app.use(currentUser);

/**
 * WebAPI
 */

const webapiRouter = Router({ mergeParams: true });

/**
 * Reporting Routes
 */
webapiRouter.get("/subscribers/report", subscriberReportRouter);
/**
 * Group Routes
 */
webapiRouter.post("/groups/unassign", unassignSubscriberGroupRouter);
webapiRouter.post("/groups/assign", assignSubscriberGroupRouter);
webapiRouter.delete("/groups/:id", deleteGroupRouter);
webapiRouter.put("/groups/:id", updateGroupRouter);
webapiRouter.get("/groups/subscribers/:id", listGroupsBySubscriberId);
webapiRouter.get("/groups/:id/subscribers", getGroupSubscribers);
webapiRouter.get("/groups/:id", getGroup);
webapiRouter.get("/groups", showGroupRouter);
webapiRouter.post("/groups", newGroupRouter);
/**
 * Subscriber Routes
 */
webapiRouter.post(
  "/subscribers/import/:groupId",
  importSubscriberToGroupRouter
);
webapiRouter.post("/subscribers/import", importSubscriberRouter);
webapiRouter.get("/subscribers/export", exportSubscribersRouter);
webapiRouter.get("/subscribers/:id", showSubsciberRouter);
webapiRouter.put("/subscribers/:id", updateSubscriberRouter);
webapiRouter.delete("/subscribers/:id", deleteSubscriberRouter);
webapiRouter.post("/subscribers", newSubscriberRouter);
webapiRouter.get("/subscribers", indexSubsciberRouter);
webapiRouter.delete("/subscribers", batchDeleteSubscriberRouter);

app.use("/v1.1/org/:orgId", validateAPIKey, webapiRouter);
app.use(
  "/webapi/org/:orgId",
  validateCognitoTokenAndOrganization,
  webapiRouter
);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
