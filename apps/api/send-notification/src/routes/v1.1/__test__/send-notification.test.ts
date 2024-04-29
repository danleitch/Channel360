import request from "supertest";
import { app } from "@app";
import { Templates } from "@models/templates";
import { Notification } from "@models/notification";

jest.mock("../../../nats-wrapper.ts");
describe("Send Notification API", () => {
  let MOCK_ORG_ID: string;
  let MOCK_TEMPLATE_ID: string;
  beforeEach(async () => {
    const organization = await global.createOrganization();

    MOCK_ORG_ID = organization.id;

    const template = Templates.build({
      category: "MARKETING",
      name: "test",
      organization: MOCK_ORG_ID,
    });

    await template.save();

    MOCK_TEMPLATE_ID = template.id;
  });

  it("RETURNS 201 WHEN creating a notification ✅", async () => {
    const response = await request(app)
      .post(`/v1.1/org/${MOCK_ORG_ID}/notification`)
      .send({
        destination: "test",
        message: {
          type: "template",
          template: {
            name: "test",
            language: {
              policy: "deterministic",
              code: "en",
            },
            components: [],
          },
        },
      })
      .expect(201);

    expect(response.body.notification).not.toBeNull();

    const template = await Templates.findById(MOCK_TEMPLATE_ID);
    expect(template!.category).toEqual("MARKETING");

    const notification = await Notification.findById(
      response.body.notification._id,
    );

    expect(notification!.scheduled).not.toBeNull();
  });

  it("RETURN 400 WHEN creating an notification with invalid parameters ❌", async () => {
    const response = await request(app)
      .post(`/v1.1/org/${MOCK_ORG_ID}/notification`)
      .send({
        destination: "test",
        message: "test",
      })
      .expect(400);

    expect(response.body.errors[0].message).toEqual(
      "Message must be a non-empty object",
    );
  });
});
