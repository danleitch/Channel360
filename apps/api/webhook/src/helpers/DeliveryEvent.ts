import { FilterQuery } from "mongoose";
import { Notification, NotificationDoc } from "@models/notification";
import { BadRequestError } from "@channel360/core";
import { NotificationStatusPublisher } from "@publishers/notification-publisher";
import { natsWrapper } from "../nats-wrapper";
import { DeliveryData } from "@interfaces/DeliveryData";
import { WebhookService } from "@services/webhook.service";
import * as Sentry from "@sentry/node";

export abstract class DeliveryEvent {
  protected notification: any;
  protected matchResult: any;
  protected conversation: any;

  constructor(protected data: DeliveryData, protected orgId: string) {
    console.log(
      `Handling event for: ${data.trigger} ${JSON.stringify(
        data.notification || data.conversation
      )}`
    );
    this.notification = data.notification;
    this.matchResult = data.matchResult;
    this.conversation = data.conversation;
  }

  abstract filter: FilterQuery<NotificationDoc>;

  abstract status: NotificationStatus;

  async handle() {
    const notification = await Notification.findOneAndUpdate(this.filter, {
      $set: {
        failure_reason: this.data.error?.message,
        conversationId: this.data.matchResult?.conversation!._id,
        status: this.status,
      },
    }).catch(() => {
      throw new BadRequestError(
        `Error Updating Notification for ${this.status}`
      );
    });

    if (!notification) {
      throw new BadRequestError(
        `Error Can't find Notification for  ${this.status}`
      );
    }

    let newData = {
      ...this.data,
      organization: this.orgId,
      id: notification._id,
    };

    /**
     * Hand Off to Client Webhook
     */

    await WebhookService.post({
      ...this.data,
      notification: {
        _id: notification._id,
      }
    }, this.orgId).catch((e) => {
      Sentry.captureException(e);
    });

    /**
     * Update the Notification Status in the Campaign Service
     */

    await new NotificationStatusPublisher(natsWrapper.client).publish(newData);
  }
}

export abstract class ConversationDeliveryEvent extends DeliveryEvent {
  async handle() {
    await Notification.updateMany(this.filter, {
      $set: {
        status: this.status,
      },
    }).catch(() => {
      throw new BadRequestError("Error Updating Notification for READ");
    });

    let newData = { ...this.data, organization: this.orgId };

    /**
     * Hand Off to Client Webhook
     */

    await WebhookService.post(this.data, this.orgId).catch((e) => {
      Sentry.captureException(e);
    });

    /**
     * Update the Notification Status in the Campaign Service
     */
    await new NotificationStatusPublisher(natsWrapper.client).publish(newData);
  }
}

export enum NotificationStatus {
  READ = "READ",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  DELIVERED_TO_CHANNEL = "DELIVERED TO CHANNEL",
}
