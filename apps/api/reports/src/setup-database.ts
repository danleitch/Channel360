import { createConnection } from "./connections";
import { modelRegistry } from "@models/index";
import ModelInitalizer from "@models/modelInitalizer";
import { ChartDoc, chartSchema } from "@models/chart";
import { NotificationDoc, notificationSchema } from "@models/notification";
import { SubscriberDoc, subscriberSchema } from "@models/subscriber";
import { CampaignsDoc, campaignsSchema } from "@models/campaigns";

let connections: ReturnType<typeof createConnection>[] = [];

export async function setupDatabase(testURI?: string) {
  if (testURI) {
    process.env.MONGO_URI = testURI;
    process.env.CAMPAIGN_MONGO_URI = testURI;
    process.env.SUBSCRIBER_MONGO_URI = testURI;
  }
  const chartConnection = createConnection(process.env.MONGO_URI!);

  const notificationConnection = createConnection(
    process.env.CAMPAIGN_MONGO_URI!,
  );

  const subscriberConnection = createConnection(
    process.env.SUBSCRIBER_MONGO_URI!,
  );

  connections.push(
    chartConnection,
    notificationConnection,
    subscriberConnection,
  );

  modelRegistry.Chart = new ModelInitalizer<ChartDoc>(
    chartConnection,
    "Chart",
    chartSchema,
  ).initializeModel();

  modelRegistry.Notification = new ModelInitalizer<NotificationDoc>(
    notificationConnection,
    "Notification",
    notificationSchema,
  ).initializeModel();

  modelRegistry.Subscriber = new ModelInitalizer<SubscriberDoc>(
    subscriberConnection,
    "Subscriber",
    subscriberSchema,
  ).initializeModel();

  modelRegistry.Campaigns = new ModelInitalizer<CampaignsDoc>(
    notificationConnection,
    "Campaigns",
    campaignsSchema,
  ).initializeModel();
}

export async function closeDatabaseConnections() {
  await Promise.all(connections.map((conn) => conn.close()));
  connections = [];
}
