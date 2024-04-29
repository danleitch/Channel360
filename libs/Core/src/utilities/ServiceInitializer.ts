import mongoose from "mongoose";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { RewriteFrames } from "@sentry/integrations";
import { NatsListenerConnectionError } from "../errors/nats-listener-connection-error";

export class ServiceInitializer {
  constructor(
    private natsWrapper: any,
    private app: any,
    private requiredEnv: string[],
    private listeners: any[] = [],
  ) {}

  async initialize() {
    // Environment variable checks

    for (const envVar of this.requiredEnv) {
      if (!process.env[envVar]) {
        throw new Error(`${envVar} must be defined`);
      }
    }

    // MongoDB connection
    await mongoose
      .connect(process.env.MONGO_URI!)
      .then(() => {
        console.log("Connected to MongoDb");
      })
      .catch((err: any) => {
        throw new Error(err);
      });

    // Sentry initialization
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new RewriteFrames({
          root: global.__dirname,
        }),
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({
          app: this.app,
        }),
      ],
      tracesSampleRate: 1.0,
    });

    // NATS connection
    await this.natsWrapper.connect(
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );
    process.on("SIGINT", () => this.natsWrapper.client.close());
    process.on("SIGTERM", () => this.natsWrapper.client.close());

    const MAX_RETRIES = 2;
    const INITIAL_DELAY = 1000; // milliseconds

    const registerListenerWithRetry = async (listenerFn: Function, retries = 0) => {
      try {
        await listenerFn().catch((error: any) => {
          console.error(error);
          throw new NatsListenerConnectionError(error.message);
        });

        console.log("Listener registered successfully! ✅");

      } catch (error: any) {

        console.log(
          `Error registering listener ${listenerFn.name}:  ${error.message} ❌`,
        );

        if (retries < MAX_RETRIES) {
          const delay = Math.pow(2, retries) * INITIAL_DELAY;

          console.log(`Retrying after ${delay}ms...`);

          await new Promise((resolve) => setTimeout(resolve, delay));

          await registerListenerWithRetry(listenerFn, retries + 1);

        } else {
          console.log(
            "Max retry attempts reached. Could not register listener.",
          );
        }
      }
    };

    // Register listeners with retry logic
    for (const listenerFn of this.listeners) {
      await registerListenerWithRetry(listenerFn);
    }

    // Start the service
    this.app.listen(3000, () => {
      console.log("Listening on port 3000!!!!!!!!");
    });
  }
}