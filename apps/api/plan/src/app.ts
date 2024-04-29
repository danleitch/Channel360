import express, { Router } from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler, NotFoundError, currentAdmin } from "@channel360/core";
import { indexPlanRouter } from "./routes";
import { createPlanRouter } from "./routes/new";
import cors from "cors";
import { updatePlanRouter } from "./routes/update";
import { showPlanRouter } from "./routes/show";
import * as Sentry from "@sentry/node";
import {
  requireAdminGroup,
  requireSuperAdmin,
  validateCognitoToken,
} from "@channel360/core";

const app = express();
app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

app.use(Sentry.Handlers.errorHandler());
app.use(cors({ origin: true, credentials: true }));
app.set("trust proxy", true);
app.use(json());
app.use(currentAdmin);

const apiRouter = Router({ mergeParams: true });
apiRouter.get("/:id", showPlanRouter);
apiRouter.put("/:id", updatePlanRouter);
apiRouter.get("", indexPlanRouter);
apiRouter.post("", createPlanRouter);

app.use("/api/plan", requireSuperAdmin, apiRouter);

/**
 * WebAPI
 */

const webapiRouter = Router({ mergeParams: true });

webapiRouter.get("/:id", showPlanRouter);
webapiRouter.put("/:id", updatePlanRouter);
webapiRouter.get("", indexPlanRouter);
webapiRouter.post("", createPlanRouter);

app.use("/webapi/plans", validateCognitoToken, requireAdminGroup, webapiRouter);

app.all("*", async (_req, _res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
