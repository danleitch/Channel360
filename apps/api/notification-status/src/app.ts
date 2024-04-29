import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import {currentAdmin, currentUser, errorHandler, NotFoundError} from "@channel360/core";

import cors from "cors";

const app = express();
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
