import { CustomerResponseEvent } from "@channel360/core";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { CustomerResponseListener } from "@listeners/customer-response-listener";
import { Notification } from "@models/notification";
import { Recipient } from "@models/reciepient";
import { Response } from "@models/response";

describe("CustomerResponseListener 📜", () => {
  /**
   * Set up the listener
   * @param notificationId
   * @param organizationId
   */
  const setup = async (notificationId: string, organizationId: string) => {
    const listener = new CustomerResponseListener(natsWrapper.client);

    const data: CustomerResponseEvent["data"] = {
      text: "YES",
      organizationId,
      notificationId,
    };

    // @ts-expect-error  should return an error: when `msg` is not acknoledged
    const msg: JsMsg = {
      ack: jest.fn(),
    };

    return { listener, data, msg };
  };

  it("should create a customer response 🧪", async () => {
    const organizationId = new mongoose.Types.ObjectId().toString();
    const campaignId = new mongoose.Types.ObjectId().toString();
    const subscriberId = new mongoose.Types.ObjectId().toString();

    const notification = Notification.build({
      campaign: new mongoose.Types.ObjectId().toString(),
      organization: organizationId,
      subscriber: new mongoose.Types.ObjectId().toString(),
      category: "MARKETING",
    });

    await notification.save();

    const recipient = Recipient.build({
      organization: organizationId,
      campaign: campaignId,
      subscriber: subscriberId,
      mobileNumber: "123456789",
      firstName: "Test",
      lastName: "User",
      optInStatus: true,
      notificationId: notification.id,
    });

    await recipient.save();

    const { listener, data, msg } = await setup(
      notification.id,
      organizationId
    );

    await listener.onMessage(data, msg);

    const campaignResponses = await Response.find({
      campaign: campaignId,
    });

    expect(campaignResponses.length).toEqual(1);

    expect(msg.ack).toHaveBeenCalled();
  });
});
