import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { ServiceInitializer } from "@channel360/core";
import { NotificationStatusListener } from "event/listeners/notification-status-listener";
import { NotificationSentListener } from "event/listeners/notification-sent-listener";

const REQUIRED_ENV = [
    "JWT_KEY",
    "MONGO_URI",
    "NATS_URL",
    "CLUSTER_ID",
    "NATS_CLIENT_ID",
    "SENTRY_DSN",
];

const initializer = new ServiceInitializer(natsWrapper, app, REQUIRED_ENV, [
    () => new NotificationStatusListener(natsWrapper.client).listen(),
    () => new NotificationSentListener(natsWrapper.client).listen(),
]);
initializer.initialize().then(() => {
    console.log("Notification Status Service Started 🟢");
});