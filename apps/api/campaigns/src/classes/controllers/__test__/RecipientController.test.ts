import { app } from "@app";
import request from "supertest";
import { Recipient } from "@models/reciepient";
import { CustomerRepliesSeeder } from "@seeders/CustomerRepliesSeeder";

jest.mock("../../../nats-wrapper.ts");

jest.mock("../../../subscriber-service.ts");

describe("Campaign Replies Export", () => {
  beforeAll(async () => {});

  it("should export a CSV file of campaign recipients for a campaign 🧪", async () => {
    await new CustomerRepliesSeeder().seed();

    // Get campaign id
    const recipient = await Recipient.findOne();
    const campaignId = recipient!.campaign;
    const orgId = recipient!.organization;

    const responseData = await request(app)
      .get(`/webapi/org/${orgId}/campaigns/${campaignId}/recipients/export`)
      .expect(200);

    console.log(responseData.text);

    expect(responseData.headers["content-type"]).toEqual(
      "text/csv; charset=utf-8"
    );
    expect(responseData.headers["content-disposition"]).toContain(
      'attachment; filename="recipients.csv"'
    );
    const records = responseData.text;

    expect(records.length).toBeGreaterThan(0);
  });

  it("should list recipients for a campaign successfully", async () => {
    await new CustomerRepliesSeeder().seed();

    const reciepient = await Recipient.findOne();
    const campaignId = reciepient!.campaign;
    const orgId = reciepient!.organization;

    // list recipients of the campaign
    const response = await request(app)
      .get(`/webapi/org/${orgId}/campaigns/${campaignId}/recipients`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.data.length).toBe(2);
    expect(response.body.totalDocuments).toBe(2);
    expect(response.body.totalPages).toBe(1);
  });

  it("should list paginated 📃 and searched 🔎 recipients for a campaign successfully", async () => {
    await new CustomerRepliesSeeder().seed();

    const reciepient = await Recipient.findOne();
    const campaignId = reciepient!.campaign;
    const orgId = reciepient!.organization;

    const pagination = { page: 1, limit: 50, search: "Ja" };

    const response = await request(app)
      .get(`/webapi/org/${orgId}/campaigns/${campaignId}/recipients`)
      .query(pagination)
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(1);
    expect(response.body.totalDocuments).toBe(1);
    expect(response.body.totalPages).toBe(1);
  });

  it("should list recipients searched and paginated", async () => {
    await new CustomerRepliesSeeder().seed();

    // Find a campaign
    const reciepient = await Recipient.findOne();
    const campaignId = reciepient!.campaign;
    const orgId = reciepient!.organization;

    const pagination = { search: "John", page: 1, limit: 50 };

    // list recipients of the campaign
    const response = await request(app)
      .get(`/webapi/org/${orgId}/campaigns/${campaignId}/recipients`)
      .query(pagination)
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(1);
    expect(response.body.totalDocuments).toBe(1);
    expect(response.body.totalPages).toBe(1);
  });
});
