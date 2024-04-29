import { NotificationSentEvent, Subjects, Listener } from "@channel360/core";
import { Notification } from "@models/notification";
import { queueNotificationGroupName } from "./queueGroupName";
import { JsMsg, NatsConnection } from "nats";

export class NotificationSentListener extends Listener<NotificationSentEvent> {
  readonly subject: Subjects.NotificationSent = Subjects.NotificationSent;

  stream = "CONVERSATION_NOTIFICATION";

  durableName = "campaign-notification-sent-consumer";

  queueGroupName = queueNotificationGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: NotificationSentEvent["data"], msg: JsMsg) {

    const { id, notification_id, organization, status } = data;

    console.log(
      `Attempting to update: ${id} with ${notification_id} to ${status}`
    );

    await Notification.findOneAndUpdate(
      {
        _id: id,
        organization,
        status: { $nin: ["READ", "DELIVERED", "FAILED", "DELIVERED TO CHANNEL"] },
      },
      {
        $set: {
          status: status,
          notification_id: notification_id,
        },
      }
    )
      .then((notification) => {
        if (!notification) {
          throw new Error(`Notification not found ${id}`);
        }
        console.log(
          `Notification Updated ${id} with ${notification_id} to ${status}`
        );
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        msg.ack();
      });
  }
}
