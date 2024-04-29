import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrganizationCreatedListener } from "@listeners/organization-created-listener";
import { NotificationListener } from "@listeners/created-notification-listener";
import { OrganizationUpdatedListener } from "@listeners/organization-updated-listener";
import { ServiceInitializer } from "@channel360/core";
import { SettingsCreatedListener } from "@listeners/settings-created-listener";
import { SettingsUpdatedListener } from "@listeners/settings-updated-listener";
import { ReplyListener } from "@listeners/reply-listener";

const REQUIRED_ENV = [
  "JWT_KEY",
  "ADMIN_JWT_KEY",
  "MONGO_URI",
  "NATS_URL",
  "CLUSTER_ID",
  "NATS_CLIENT_ID",
  "SENTRY_DSN",
  "AWS_COGNITO_CLIENT_ID",
  "AWS_COGNITO_POOL_ID",
];

const initializer = new ServiceInitializer(natsWrapper, app, REQUIRED_ENV, [
  () => new OrganizationCreatedListener(natsWrapper.client).listen().then(() => console.log("Organization Created Listener registered successfully! ✅")),
  () => new OrganizationUpdatedListener(natsWrapper.client).listen().then(() => console.log("Organization Updated Listener registered successfully! ✅")),
  () => new SettingsCreatedListener(natsWrapper.client).listen().then(() => console.log("Settings Created Listener registered successfully! ✅")),
  () => new SettingsUpdatedListener(natsWrapper.client).listen().then(() => console.log("Settings Updated Listener registered successfully! ✅")),
  () => new ReplyListener(natsWrapper.client).listen().then(() => console.log("Reply Listener registered successfully! ✅")),
  () => new NotificationListener(natsWrapper.client).listen().then(() => console.log("Notification Listener registered successfully! ✅")),
]);
initializer.initialize().then(() => {
  console.log("Conversation Service Started 🛡🟢");
});
