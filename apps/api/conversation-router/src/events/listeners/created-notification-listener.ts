import {
  Listener,
  ModelFinder,
  NotificationCreatedEvent,
  SmoochAPI,
  Subjects,
} from "@channel360/core";
import { SmoochApp } from "@models/smoochApp";
import { Notification } from "@models/notification";
import mongoose from "mongoose";
import { JsMsg, NatsConnection } from "nats";
import { NotificationSentPublisher } from "@publishers/notification-sent-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { notificationQueueGroupName } from "./queuGroupName";

interface SmoochNotificationResponse {
  status: number;
  data: {
    notification: {
      _id: string;
    };
  };
}

export class NotificationListener extends Listener<NotificationCreatedEvent> {
  readonly subject: Subjects.NotificationCreated = Subjects.NotificationCreated;

  stream = "NOTIFICATION";

  durableName = "notification-created-consumer";

  queueGroupName = notificationQueueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient, { max_deliver: 0 });
  }

  async onMessage(data: NotificationCreatedEvent["data"], msg: JsMsg) {
    const { category, organizationId, campaignId, destinationId, message,scheduled } =
      data;

    const smoochApp = await ModelFinder.findOneOrFail(
      SmoochApp,
      {
        organization: organizationId,
      },
      "Organization is not connected to Whatsapp",
    );

    const { appId, integrationId } = smoochApp;

    const smoochApiClient = new SmoochAPI(appId);

    /**
     * Create Whatsapp Template
     */

    const { status, data: responseData } =
      await smoochApiClient.makePostRequest<SmoochNotificationResponse>(
        `/notifications`,
        JSON.stringify({
          destination: {
            integrationId,
            destinationId,
          },
          message,
          author: {
            role: "appMaker",
          },
          messageSchema: "whatsapp",
        }),
      );

    msg.ack();

    if (status === 201) {
      const notificationData = {
        id: data.id,
        category: category,
        organization: organizationId,
        notification_id: responseData.notification._id,
        campaign: campaignId,
        mobileNumber: destinationId,
        status: "SUBMITTED",
        scheduled: scheduled
      };

      const notification = Notification.build(notificationData);

      await new NotificationSentPublisher(natsWrapper.client).publish(
        notificationData,
      );

      await notification.save();
    } else {
      console.log(responseData);

      const notificationData = {
        id: data.id,
        category: category,
        reference: new mongoose.Types.ObjectId().toString(),
        notification_id: "",
        campaign: campaignId,
        organization: organizationId,
        mobileNumber: destinationId,
        status: "FAILED",
        scheduled
      };

      const notification = Notification.build(notificationData);

      await new NotificationSentPublisher(natsWrapper.client).publish(
        notificationData,
      );

      await notification.save();
    }
  }
}
