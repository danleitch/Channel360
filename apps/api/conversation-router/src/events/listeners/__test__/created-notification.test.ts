import { NotificationCreatedEvent } from "@channel360/core";
import { NotificationListener } from "@listeners/created-notification-listener";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { SmoochApp } from "@models/smoochApp";
import { Notification } from "@models/notification";

jest.mock("@channel360/core", () => {
  return {
    ...jest.requireActual("@channel360/core"),
    SmoochAPI: jest.fn().mockImplementation(() => ({
      makePostRequest: jest.fn().mockImplementation(() =>
        Promise.resolve({
          status: 201, // Default to a success scenario, e.g., resource created
          data: {
            notification: {
              _id: "c4408c0e-31de-43c9-99c0-ab10ca967162",
            },
          },
        }),
      ),
    })),
  };
});

describe("creating a notification event 📜", () => {
  let setup: () =>
    | PromiseLike<{ listener: any; data: any; msg: any }>
    | { listener: any; data: any; msg: any };

  const MOCK_NOTIFICATION_ID = new mongoose.Types.ObjectId().toString();

  beforeAll(() => {
    /**
     * Set up the listener 👂
     */
    setup = async () => {
      const { id: organizationId } = await global.createOrganization();

      const smoochApp = SmoochApp.build({
        appId: "123",
        name: "Test",
        organization: organizationId,
      });

      await smoochApp.save();

      const listener = new NotificationListener(natsWrapper.client);

      const data: NotificationCreatedEvent["data"] = {
        id: MOCK_NOTIFICATION_ID,
        category: "MARKETING",
        organizationId,
        destinationId: "_2765622778",
        message: {
          type: "template",
          template: {
            name: "generic",
            language: {
              policy: "deterministic",
              code: "en",
            },
            components: [],
          },
        },
      };

      // @ts-ignore
      const msg: JsMsg = {
        ack: jest.fn(),
      };

      return { listener, data, msg };
    };
  });

  it("SHOULD send a notification successfully 🧪✅", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const notification = await Notification.findById(MOCK_NOTIFICATION_ID);

    expect(notification!.status).toEqual("SUBMITTED");
  });

  it("SHOULD fail when smooch sends back anything other than 200 ok 🧪❌", async () => {
    const { SmoochAPI } = require("@channel360/core");
    SmoochAPI.mockImplementationOnce(() => ({
      makePostRequest: jest.fn().mockImplementation(() =>
        Promise.resolve({
          status: 400,
          data: {
            error: "Bad Request",
          },
        }),
      ),
    }));
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const notification = await Notification.findById(MOCK_NOTIFICATION_ID);

    expect(notification!.status).toEqual("FAILED");
  });
});
