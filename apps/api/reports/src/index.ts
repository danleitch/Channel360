import { app } from "./app";
import { setupDatabase } from "./setup-database";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.USER_MONGO_URI) {
    throw new Error("USER_MONGO_URI must be defined");
  }
  if (!process.env.CONVERSATION_MONGO_URI) {
    throw new Error("CONVERSATION_MONGO_URI must be defined");
  }
  if (!process.env.CAMPAIGN_MONGO_URI) {
    throw new Error("CONVERSATION_MONGO_URI must be defined");
  }
  if (!process.env.SUBSCRIBER_MONGO_URI) {
    throw new Error("SUBSCRIBER_MONGO_URI must be defined");
  }
  if (!process.env.LOGGING_MONGO_URI) {
    throw new Error("LOGGING_MONGO_URI must be defined");
  }
  if (!process.env.TEMPLATE_MONGO_URI) {
    throw new Error("TEMPLATE_MONGO_URI must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  setupDatabase().catch(console.error);

  console.log("Connected to MongoDb");

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start().then(() => console.log("Reports Started"));
