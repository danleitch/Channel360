import { app } from "@app";
import request from "supertest";
import { Campaigns } from "@models/campaigns";
import { Response as CampaignResponse } from "@models/response";
import { CustomerRepliesSeeder } from "@seeders/CustomerRepliesSeeder";

jest.mock("../../../nats-wrapper.ts");

jest.mock("../../../subscriber-service.ts");

describe("Campaign Replies Export", () => {
  beforeAll(async () => {});

  it("should export a CSV file of campaign Replies  for a campaign 🧪", async () => {
    await new CustomerRepliesSeeder().seed();

    // Get campaign id
    const campaign = await Campaigns.findOne();
    const campaignId = campaign!.id;
    const orgId = campaign!.organization;

    const responseData = await request(app)
      .get(
        `/webapi/org/${orgId}/campaigns/${campaignId}/recipients/replies/export`
      )
      .expect(200);

      console.log(responseData.text);
      

    expect(responseData.headers["content-type"]).toEqual(
      "text/csv; charset=utf-8"
    );
    expect(responseData.headers["content-disposition"]).toContain(
      'attachment; filename="campaign-replies.csv"'
    );

    const records = responseData.text;
    expect(records.length).toBeGreaterThan(0);
  });

  it("should list replies for a campaign successfully", async () => {
    await new CustomerRepliesSeeder().seed();

    const response = await CampaignResponse.findOne();
    const campaignId = response!.campaign;
    const orgId = response!.organization;

    const responseData = await request(app)
      .get(`/webapi/org/${orgId}/campaigns/${campaignId}/recipients/replies`)
      .expect(200);

    expect(responseData.body.data.length).toBeGreaterThan(0);
    expect(responseData.body.totalDocuments).toBeGreaterThan(0);
    expect(responseData.body.totalPages).toBeGreaterThan(0);
  });
});
