import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { ServiceInitializer } from "@channel360/core";
import { UserCreatedListener } from "@listeners/user-created-listener";
import { PlanCreatedListener } from "@listeners/plan-created-listener";
import { UserUpdatedListener } from "@listeners/user-updated-listener";
import { PlanUpdatedListener } from "@listeners/plan-updated-listener";
import { config } from "aws-sdk";

config.update({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env["AWS_ACCESS_KEY_ID"]!,
    secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"]!,
  }
});

const REQUIRED_ENV = [
  "JWT_KEY",
  "MONGO_URI",
  "NATS_URL",
  "CLUSTER_ID",
  "NATS_CLIENT_ID",
  "SENTRY_DSN",
  "SITE_URL",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_COGNITO_CLIENT_ID",
  "AWS_COGNITO_CLIENT_SECRET",
  "AWS_COGNITO_REGION",
  "AWS_COGNITO_POOL_ID"
];

const initializer = new ServiceInitializer(natsWrapper, app, REQUIRED_ENV, [
  () => new UserCreatedListener(natsWrapper.client).listen(),
  () => new UserUpdatedListener(natsWrapper.client).listen(),
  () => new PlanCreatedListener(natsWrapper.client).listen(),
  () => new PlanUpdatedListener(natsWrapper.client).listen(),
]);
initializer.initialize().then(() => {
  console.log("Organization Service Started 🟢");
});
