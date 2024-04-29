import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUser, errorHandler, NotFoundError } from "@channel360/core";
import cors from "cors";
import agenda from "./jobs/index";

const Agendash = require("agendash");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.set("trust proxy", true);
app.use(json());

app.use(currentUser);

app.use("/api/scheduler/dash", Agendash(agenda));

(async function () {
  await agenda.start();

  await agenda.every("1 hour", "sync templates").then((r) => console.log(r));
})();

app.all("*", async (_req, _res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
