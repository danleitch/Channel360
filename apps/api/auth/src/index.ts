import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";
import { ServiceInitializer } from "@channel360/core";
import {config} from 'aws-sdk';

config.update({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env["AWS_ACCESS_KEY_ID"]!,
    secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"]!,
  }
});

const REQUIRED_ENV = [
  "JWT_KEY",
  "ADMIN_JWT_KEY",
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


const initializer = new ServiceInitializer(natsWrapper, app, REQUIRED_ENV);
initializer.initialize().then(() => {
  console.log("Auth Service Started 🛡🟢");
});
