import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { ServiceInitializer } from "@channel360/core";
import { CampaignCreatedListener } from "@listeners/campaign-created-listener";
import { CampaignUpdatedListener } from "@listeners/campaign-updated-listener";
import { CampaignDeletedListener } from "@listeners/campaing-deleted-listener";

const REQUIRED_ENV = [
  "JWT_KEY",
  "MONGO_URI",
  "NATS_URL",
  "CLUSTER_ID",
  "NATS_CLIENT_ID",
  "SENTRY_DSN",
];

const initializer = new ServiceInitializer(natsWrapper, app, REQUIRED_ENV, [
  () => new CampaignCreatedListener(natsWrapper.client).listen(),
  () => new CampaignUpdatedListener(natsWrapper.client).listen(),
  () => new CampaignDeletedListener(natsWrapper.client).listen(),
]);
initializer.initialize().then(() => {
  console.log("Scheduler Service Started 🟢");
});
