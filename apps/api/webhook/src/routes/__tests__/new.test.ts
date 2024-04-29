import request from "supertest";
import { app } from "@app";
import { Webhook } from "@models/webhook";
import mongoose from "mongoose";

describe("Managing Webhooks 📜", () => {
  it("should return 201 when creating a webhook 🧪", async () => {
    const orgId = new mongoose.Types.ObjectId()

    const res = await request(app)
      .post(`/webapi/org/${orgId.toString()}/webhooks`)
      .send({
        target: "https://www.google.com",
        triggers: ["notification:delivery:channel"],
      });
    expect(res.status).toEqual(201);
  });

  it("should return 200 when fetching all webhooks 🧪", async () => {
    const orgId = new mongoose.Types.ObjectId()

    const webhook = Webhook.build({
      organization: orgId.toString(),
      target: "https://www.google.com",
      triggers: ["notification:delivery:channel"],
    });

    await webhook.save();

    const res = await request(app)
      .get(`/webapi/org/${orgId}/webhooks`)
      .send()

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1 );
  })

  it("should return 200 when deleting a webhook 🧪", async () => {
    const orgId = new mongoose.Types.ObjectId()

    const webhook = Webhook.build({
      organization: orgId.toString(),
      target: "https://www.google.com",
      triggers: ["notification:delivery:channel"],
    });

    await webhook.save();

    const res = await request(app)
      .delete(`/webapi/org/${orgId}/webhooks/${webhook.id}`)
      .send()

    expect(res.status).toEqual(200);

  });
});
