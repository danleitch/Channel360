import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { EmailListener } from "@listeners/email-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.SITE_URL) {
    throw new Error("SITE_URL must be defined");
  }
  if (!process.env.API_URL) {
    throw new Error("API_URL must be defined");
  }
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY must be defined");
  }

  await natsWrapper.connect(process.env.NATS_CLIENT_ID, process.env.NATS_URL);

  // Interrupt node service
  process.on("SIGINT", () => natsWrapper.client.close());
  // Close node service
  process.on("SIGTERM", () => natsWrapper.client.close());

  await new EmailListener(natsWrapper.client)
    .listen()
    .catch((e) =>
      console.log("Could not register EmailListener listener 🚫", e)
    );

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start().then((_) => console.log("Started"));
