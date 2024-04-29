import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import {
  currentAdmin,
  currentUser,
  errorHandler,
  NotFoundError,
} from "@channel360/core";

import cors from "cors";
import * as Sentry from "@sentry/node";

const app = express();
app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

app.use(Sentry.Handlers.errorHandler());
app.use(cors({ origin: true, credentials: true }));
app.set("trust proxy", true);
app.use(json());
app.use(currentUser);
app.use(currentAdmin);

app.all("*", async (_req, _res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
