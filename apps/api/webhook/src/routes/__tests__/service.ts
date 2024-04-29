import request from "supertest";
import { app } from "@app";
import { Notification } from "@models/notification";
import { DeliveryData } from "@interfaces//DeliveryData";
import { AppUser } from "@models/appUser";

jest.mock("../../nats-wrapper.ts");

describe("Updating Notification Status", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("UPDATES the notification to DELIVERED TO CHANNEL", async () => {
    const organization = await global.createOrganization();

    // Create Notification
    const notification = Notification.build({
      organization: organization.id,
      notification_id: "4361f976-f4a8-4082-88b5-0sghjkd75f22f8",
      status: "SUBMITTED",
    });

    await notification.save();

    const mockDeliveryChannelEvent: DeliveryData = {
      trigger: "notification:delivery:channel",
      app: { _id: "6474b3aab1428a60b60a8b05" },
      destination: {
        destinationId: "27656225667",
      },
      notification: { _id: "4361f976-f4a8-4082-88b5-0sghjkd75f22f8" },
      matchResult: {
        appUser: { _id: "371ee95e05c4194efd0ad662", conversationStarted: true },
        conversation: { _id: "e872d673749b8e9a0fa3ed3a" },
      },
    };

    await request(app)
      .post(`/api/services/${organization.id}`)
      .send(mockDeliveryChannelEvent)
      .expect(200);

    const notificationUpdated = await Notification.find({
      notification_id: "4361f976-f4a8-4082-88b5-0sghjkd75f22f8",
    });

    expect(notificationUpdated[0].status).toEqual("DELIVERED TO CHANNEL");

    //Expect App User to be created
    const appUserObj = await AppUser.find({
      appUser: "371ee95e05c4194efd0ad662",
    });
    expect(appUserObj).toBeDefined();
  });

  it("UPDATES the notification to DELIVERED", async () => {
    const organization = await global.createOrganization();

    // Create Notification
    const notification = Notification.build({
      organization: organization.id,
      notification_id: "4361f976-f4a8-4082-88b5-0sghjkd75f22f8",
      status: "DELIVERED TO CHANNEL",
    });

    await notification.save();

    const mockDeliveryChannelEvent: DeliveryData = {
      trigger: "notification:delivery:user",
      app: { _id: "6474b3aab1428a60b60a8b05" },
      destination: {
        destinationId: "27656225667",
      },
      notification: { _id: "4361f976-f4a8-4082-88b5-0sghjkd75f22f8" },
      matchResult: {
        appUser: { _id: "371ee95e05c4194efd0ad662", conversationStarted: true },
        conversation: { _id: "e872d673749b8e9a0fa3ed3a" },
      },
    };

    await request(app)
      .post(`/api/services/${organization.id}`)
      .send(mockDeliveryChannelEvent)
      .expect(200);

    const notificationUpdated = await Notification.find({
      notification_id: "4361f976-f4a8-4082-88b5-0sghjkd75f22f8",
    });

    expect(notificationUpdated[0].status).toEqual("DELIVERED");
  });

  it("UPDATES the notification to READ", async () => {
    const organization = await global.createOrganization();

    // Create Notification
    const notification = Notification.build({
      organization: organization.id,
      notification_id: "4361f976-f4a8-4082-88b5-0sghjkd75f22f8",
      conversationId: "kcq3arqnbdydw78",
      status: "DELIVERED TO CHANNEL",
    });

    await notification.save();

    const mockDeliveryChannelEvent: DeliveryData = {
      trigger: "conversation:read",
      app: { _id: "2ipu5vx2xkb7obg" },
      appUser: {
        _id: "2t6c9d342wbt9di",
        conversationStarted: true,
      },
      conversation: {
        _id: "kcq3arqnbdydw78",
      },
    };

    await request(app)
      .post(`/api/services/${organization.id}`)
      .send(mockDeliveryChannelEvent)
      .expect(200);

    const notificationUpdated = await Notification.find({
      notification_id: "4361f976-f4a8-4082-88b5-0sghjkd75f22f8",
    });

    expect(notificationUpdated[0].status).toEqual("READ");
  });

  it("UPDATES the notification to FAILED", async () => {
    const organization = await global.createOrganization();

    // Create Notification
    const notification = Notification.build({
      organization: organization.id,
      notification_id: "4361f976-f4a8-4082-88b5-0sghjkd75f22f8",
      status: "SUBMITTED",
    });

    await notification.save();

    const mockDeliveryChannelEvent: DeliveryData = {
      trigger: "notification:delivery:failure",
      app: { _id: "6474b3aab1428a60b60a8b05" },
      destination: {
        destinationId: "27656225667",
      },
      notification: { _id: "4361f976-f4a8-4082-88b5-0sghjkd75f22f8" },
    };

    await request(app)
      .post(`/api/services/${organization.id}`)
      .send(mockDeliveryChannelEvent)
      .expect(200);

    const notificationUpdated = await Notification.find({
      notification_id: "4361f976-f4a8-4082-88b5-0sghjkd75f22f8",
    });

    expect(notificationUpdated[0].status).toEqual("FAILED");
  });
});
