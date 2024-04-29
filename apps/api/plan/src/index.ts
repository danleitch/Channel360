import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { ServiceInitializer } from "@channel360/core";

const REQUIRED_ENV = [
  "JWT_KEY",
  "MONGO_URI",
  "NATS_URL",
  "CLUSTER_ID",
  "NATS_CLIENT_ID",
  "SENTRY_DSN",
  "AWS_COGNITO_CLIENT_ID",
  "AWS_COGNITO_POOL_ID",
];

const initializer = new ServiceInitializer(natsWrapper, app, REQUIRED_ENV);
initializer.initialize().then(() => {
  console.log("Plan Service Started 🟢");
});
