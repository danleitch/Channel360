import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { ServiceInitializer } from "@channel360/core";
import { CampaignSendListener } from "@listeners/campaign-send-listener";

const REQUIRED_ENV = [
  "JWT_KEY",
  "MONGO_URI",
  "NATS_URL",
  "CLUSTER_ID",
  "NATS_CLIENT_ID",
  "SENTRY_DSN",
];

const initializer = new ServiceInitializer(natsWrapper, app, REQUIRED_ENV, [
  () => new CampaignSendListener(natsWrapper.client).listen(),
]);
initializer.initialize().then(() => {
  console.log("Send Campaign Service Started 🟢");
});
