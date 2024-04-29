import {
  Listener,
  Subjects,
  CustomerResponseEvent,
  ModelFinder,
} from "@channel360/core";
import { NatsConnection, JsMsg } from "nats";
import { Notification } from "@models/notification";
import { Response } from "@models/response";
import { Recipient } from "@models/reciepient";

/**

 * @class CustomerResponseListener
 * @extends Listener
 * @description Listening to customer responses for capturing quick replies to campaigns
 */
export class CustomerResponseListener extends Listener<CustomerResponseEvent> {
  readonly subject: Subjects.CustomerResponseCreated =
    Subjects.CustomerResponseCreated;

  stream = "CUSTOMER_RESPONSE";

  durableName = "customer-response-consumer";

  queueGroupName = "customer-service";

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: CustomerResponseEvent["data"], msg: JsMsg) {
    console.log("Customer Response", data);

    const { organizationId, text, notificationId } = data;

    /**
     * Validate that the notification exists 🔎
     */

    const notification = await ModelFinder.findByIdOrFail(
      Notification,
      notificationId,
      "Could not find notification"
    );

    /**
     * Validate that the notification belongs to a campaign 🔎
     */

    if (!notification.campaign) {
      return msg.ack();
    }

    const recipient = await ModelFinder.findOneOrFail(
      Recipient,
      { notificationId },
      "Could not find recipient"
    );

    const customerResponse = Response.build({
      organization: organizationId,
      text,
      recipient: recipient.id,
      campaign: recipient.campaign,
    });

    await customerResponse.save();

    msg.ack();
  }
}
