import request from "supertest";
import mongoose from "mongoose";
import { app } from "@app";
import { Webhook } from "@models/webhook";
describe("deleting a webhook", () => {
  it("Should successfully delete a webhook", async () => {
    const orgId = new mongoose.Types.ObjectId()

    await request(app)
      .post(`/webapi/org/${orgId.toString()}/webhooks`)
      .send({
        target: "https://www.google.com",
        triggers: ["notification:delivery:channel"],
      }).expect(201);

    // Delete the webhook

    const webhook = await Webhook.findOne();

    const response = await request(app).delete(`/webapi/org/${orgId.toString()}/webhooks/${webhook!._id}`);

    expect(response.status).toEqual(200);

    const webhooks =  await Webhook.find();

    expect(webhooks.length).toEqual(0)

  });
});
