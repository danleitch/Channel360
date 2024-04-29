import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { ServiceInitializer } from "@channel360/core";
import {
  APIKeyCreatedListener,
  APIKeyUpdatedListener,
} from "@listeners/api-key-listener";
import { GroupCreatedListener } from "@listeners/group-created-listener";
import { GroupDeletedListener } from "@listeners/group-deleted-listener";
import { SettingsUpdatedListener } from "@listeners/settings-updated-listener";
import { SettingsCreatedListener } from "@listeners/settings-created-listener";
import { TemplateImportedListener } from "@listeners/template-imported-listener";
import { OrganizationCreatedListener } from "@listeners/organization-created-listener";
import { OrganizationUpdatedListener } from "@listeners/organization-updated-listener";
import { TemplateInternalUpdatedListener } from "@listeners/template-updated-listener";
import { CustomerResponseListener } from "@listeners/customer-response-listener";

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

const initializer = new ServiceInitializer(natsWrapper, app, REQUIRED_ENV, [
  () =>
    new OrganizationCreatedListener(natsWrapper.client)
      .listen()
      .catch((err) => {
        console.log(err);
      }),
  () =>
    new OrganizationUpdatedListener(natsWrapper.client)
      .listen()
      .catch((err) => {
        console.log(err);
      }),
  () =>
    new TemplateInternalUpdatedListener(natsWrapper.client)
      .listen()
      .catch((err) => {
        console.log(err);
      }),
  () =>
    new TemplateImportedListener(natsWrapper.client).listen().catch((err) => {
      console.log(err);
    }),
  () =>
    new GroupCreatedListener(natsWrapper.client).listen().catch((err) => {
      console.log(err);
    }),
  () =>
    new GroupDeletedListener(natsWrapper.client).listen().catch((err) => {
      console.log(err);
    }),
  () =>
    new SettingsCreatedListener(natsWrapper.client).listen().catch((err) => {
      console.log(err);
    }),
  () =>
    new SettingsUpdatedListener(natsWrapper.client).listen().catch((err) => {
      console.log(err);
    }),
  () =>
    new APIKeyCreatedListener(natsWrapper.client).listen().catch((err) => {
      console.log(err);
    }),
  () =>
    new APIKeyUpdatedListener(natsWrapper.client).listen().catch((err) => {
      console.log(err);
    }),
  () =>
    new CustomerResponseListener(natsWrapper.client).listen().catch((err) => {
      console.log(err);
    }),
]);
initializer.initialize().then(() => {
  console.log("Campaign Service Started 🟢");
});
