import { JsMsg } from "nats";
import mongoose from "mongoose";
import { CampaignSendEvent } from "@channel360/core";
import { publishNotification } from "@helpers/publishNotification";
import { CampaignSendListener } from "@listeners/campaign-send-listener";
import { Templates } from "@models/templates";
import { Campaigns } from "@models/campaigns";
import { Recipient } from "@models/reciepient";
import { natsWrapper } from "../../../nats-wrapper";

jest.mock("@publishers/notification-publisher", () => {
  return {
    NotificationCreatedPublisher: jest.fn().mockImplementation(() => {
      return {
        publish: jest.fn(),
      };
    }),
  };
});

jest.mock("@helpers/publishNotification", () => ({
  publishNotification: jest.fn().mockResolvedValue(true),
}));

const mockPublishNotification = publishNotification as jest.Mock;

const setup = async (campaignId: string) => {
  //create an instance of the listener
  // @ts-ignore
  const listener = new CampaignSendListener(natsWrapper.client);

  //Create a fake data event

  const data: CampaignSendEvent["data"] = {
    id: campaignId,
    reference: "1234",
    version: 0,
  };

  //Create a fake message object

  // @ts-ignore
  const message: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

describe("Sending a hard-coded tag  in a campaign", () => {
  it("Sends a hard-coded tag in the body and buttons", async () => {
    const templateId = new mongoose.Types.ObjectId().toString();
    const orgId = new mongoose.Types.ObjectId().toString();

    const template = Templates.build({
      category: "MARKETING",
      components: [
        {
          type: "BODY",
          text: "Hi, The following event:{{1}} will be held at the following address {{2}}",
          buttons: [],
        },
        {
          type: "BUTTONS",
          buttons: [
            {
              type: "URL",
              text: "JOIN SPOT",
              url: "https://channel360.co.za/{{1}}",
            },
            {
              type: "PHONE_NUMBER",
              text: "Phone Number",
              phoneNumber: "+27656346543",
            },
          ],
        },
      ],
      tags: {
        head: [],
        body: [],
      },
      description: "auto-ingested",
      id: templateId,
      language: "en",
      name: "test_template",
      namespace: "abc",
      organization: orgId,
    });

    await template.save();

    const campaign = Campaigns.build({
      creator: new mongoose.Types.ObjectId().toString(),
      organization: orgId,
      reference: "1234",
      scheduled: new Date(Date.now() - 10000),
      status: "enabled",
      subscriberGroup: new mongoose.Types.ObjectId().toString(),
      template: templateId,
      tags: {
        head: [],
        body: [
          { index: 1, type: "hard-coded", value: "Ultra" },
          {
            index: 2,
            type: "hard-coded",
            value: "Grande stadium",
          },
        ],
        buttons: [{ type: "hard-coded", value: "123" }],
      },
    });

    const recipient1 = Recipient.build({
      organization: orgId,
      campaign: campaign._id,
      mobileNumber: "+27724660304",
      subscriber: new mongoose.Types.ObjectId().toString(),
      firstName: "Sidwell Avuyile",
      lastName: "Batyi",
      optInStatus: true,
    });
    const recipient2 = Recipient.build({
      organization: orgId,
      campaign: campaign._id,
      mobileNumber: "+2765622567",
      subscriber: new mongoose.Types.ObjectId().toString(),
      firstName: "Mitchel",
      lastName: "Yuen",
      optInStatus: true,
    });

    await recipient1.save();
    await recipient2.save();

    await campaign.save();

    const { listener, data, message } = await setup(campaign.id);

    //call the onMessage function with the data object + message object

    await listener.onMessage(data, message);

    expect(mockPublishNotification).toHaveBeenCalledTimes(2);
    expect(mockPublishNotification.mock.calls[1][4]).toEqual(
      // Adjust the index based on the actual structure
      expect.arrayContaining([
        expect.objectContaining({
          type: "BODY",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              text: "Ultra",
              type: "text",
            }),
            expect.objectContaining({
              text: "Grande stadium",
              type: "text",
            }),
          ]),
        }),
        expect.objectContaining({
          type: "BUTTON",
          sub_type: "url",
          index: 0,
          parameters: expect.arrayContaining([
            expect.objectContaining({
              text: "123",
              type: "text",
            }),
          ]),
        }),
      ]),
    );
  });
});
