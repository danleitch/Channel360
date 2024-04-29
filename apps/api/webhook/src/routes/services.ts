import express, { Request, Response } from "express";
import { NotificationDoc } from "@models/notification";
import { FilterQuery } from "mongoose";
import {
  ConversationDeliveryEvent,
  DeliveryEvent,
  NotificationStatus,
} from "@helpers/DeliveryEvent";
import { MessageProcessor } from "@helpers/MessageProcessor";
import { AppUserManager } from "@helpers/AppUserManager";
import { DeliveryData } from "@interfaces/DeliveryData";
import { WebhookService } from "@services/webhook.service";
import * as Sentry from "@sentry/node";
import { QuickReplyProcessor } from "@helpers/QuickReplyProcessor";

const router = express.Router({ mergeParams: true });
/**
 * docs for webhooks: https://docs.smooch.io/guide/v1/outbound-messaging/#webhooks
 */
router.use(async (req: Request, res: Response) => {
  const { trigger } = req.body;

  const data = req.body as DeliveryData;

  const orgId = req.params.orgId;

  switch (trigger) {
    case "notification:delivery:channel":
      await new DeliveryChannel(data, orgId).handle();
      // Create an App User if it doesn't exist
      new AppUserManager(data, orgId).create();
      break;
    case "notification:delivery:failure":
      await new DeliveryFailure(data, orgId).handle();
      break;
    case "notification:delivery:user":
      await new DeliveryUser(data, orgId).handle();
      break;
    case "conversation:read":
      await new DeliveryRead(data, orgId).handle();
      break;
    case "message:appUser":
      await WebhookService.post(data, orgId).catch((e) => {
        Sentry.captureException(e);
      });
      await new MessageProcessor(data, orgId).message();
      await new QuickReplyProcessor(data, orgId).message();

      break;
  }

  res.status(200).send("Notification has been called");
});

class DeliveryChannel extends DeliveryEvent {
  filter: FilterQuery<NotificationDoc> = {
    notification_id: this.notification?._id,
    organization: this.orgId,
    status: { $nin: ["READ", "DELIVERED"] },
  };

  status: NotificationStatus = NotificationStatus.DELIVERED_TO_CHANNEL;
}

class DeliveryUser extends DeliveryEvent {
  filter: FilterQuery<NotificationDoc> = {
    notification_id: this.notification?._id,
    organization: this.orgId,
    status: { $nin: ["READ"] },
  };

  status: NotificationStatus = NotificationStatus.DELIVERED;
}

class DeliveryFailure extends DeliveryEvent {
  filter: FilterQuery<NotificationDoc> = {
    notification_id: this.notification?._id,
    organization: this.orgId,
  };

  status: NotificationStatus = NotificationStatus.FAILED;
}

class DeliveryRead extends ConversationDeliveryEvent {
  filter: FilterQuery<NotificationDoc> = {
    conversationId: this.conversation?._id,
    organization: this.orgId,
  };

  status: NotificationStatus = NotificationStatus.READ;
}

export { router as smoochWebhooksRouter };
