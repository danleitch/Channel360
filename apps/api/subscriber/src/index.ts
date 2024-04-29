import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { ServiceInitializer } from "@channel360/core";
import { OrganizationCreatedListener } from "@listeners/organization-created-listener";
import { OrganizationUpdatedListener } from "@listeners/organization-updated-listener";
import { SubscriberOptListener } from "@listeners/susbcriber-opt-listener";

const REQUIRED_ENV = [
  "JWT_KEY",
  "MONGO_URI",
  "NATS_URL",
  "CLUSTER_ID",
  "NATS_CLIENT_ID",
  "SENTRY_DSN",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_COGNITO_CLIENT_ID",
  "AWS_COGNITO_CLIENT_SECRET",
  "AWS_COGNITO_REGION",
  "AWS_COGNITO_POOL_ID",
];

const initializer = new ServiceInitializer(natsWrapper, app, REQUIRED_ENV, [
  () => new OrganizationCreatedListener(natsWrapper.client).listen(),
  () => new SubscriberOptListener(natsWrapper.client).listen(),
  () => new OrganizationUpdatedListener(natsWrapper.client).listen(),
]);
initializer.initialize().then(() => {
  console.log("Subscriber Service Started 🟢");
});
