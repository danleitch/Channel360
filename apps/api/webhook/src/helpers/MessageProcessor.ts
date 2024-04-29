import { ModelFinder, NotFoundError } from "@channel360/core";
import { SubscriberOptPublisher } from "@publishers/subscriber-opt-publisher";
import { natsWrapper } from "../nats-wrapper";
import { Organization } from "@models/organization";
import { Settings } from "@models/settings";
import { Notification } from "@models/notification";
import { ReplyPublisher } from "@publishers/reply-publisher";
import { DeliveryData } from "@interfaces/DeliveryData";

export class MessageProcessor {
  conversation: any;
  messages: any;

  constructor(protected data: DeliveryData, protected orgId: string) {
    this.conversation = data.conversation;
    this.messages = data.messages;
  }

  async message() {
    if (!this.messages || !Array.isArray(this.messages) || !this.conversation) {
      throw new NotFoundError();
    }

    const OptWords = [
      "STOP",
      "STOPALL",
      "STOP ALL",
      "STOP ALL MESSAGES",
      "OPT OUT",
      "OPTOUT",
      "OPTIN",
      "OPT IN",
      "SUBSCRIBE",
      "UNSUBSCRIBE",
      "UNSUB",
      "UNSUB ALL",
    ];

    const OptOutWords = [
      "STOP",
      "STOPALL",
      "STOP ALL",
      "STOP ALL MESSAGES",
      "OPT OUT",
      "OPTOUT",
      "UNSUBSCRIBE",
      "UNSUB",
      "UNSUB ALL",
    ];

    for (const message of this.messages) {
      if (!message?.text) {
        return;
      }
      if (OptWords.includes(message?.text?.toUpperCase())) {
        const notification = await ModelFinder.findOneOrFail(
          Notification,
          {
            conversationId: this.conversation?._id,
          },
          "Notification not found"
        );

        const org = await Organization.findById(this.orgId);

        const settings = await ModelFinder.findByIdOrFail(
          Settings,
          org!.settings,
          "Settings not found"
        );

        await new SubscriberOptPublisher(natsWrapper.client).publish({
          id: notification.mobileNumber!,
          organization: this.orgId,
          optInStatus: !OptOutWords.includes(message.text.toUpperCase()),
        });

        await new ReplyPublisher(natsWrapper.client).publish({
          text: !OptOutWords.includes(message.text.toUpperCase())
            ? settings.optInMessage
            : settings.optOutMessage,
          authorId: message.authorId,
          organizationId: this.orgId,
        });
      }
    }
  }
}
