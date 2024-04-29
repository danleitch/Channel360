import { Campaigns } from "@models/campaigns";
import { CustomerRepliesSeeder } from "@seeders/CustomerRepliesSeeder";
import CampaignResponsesRepository from "@repositories/CampaignResponsesRepository";

describe("Campaign Replies 📜", () => {
  it("should return a list of campaign replies for a campaign 🧪", async () => {
    await new CustomerRepliesSeeder().seed();

    const response = await Campaigns.findOne();
    const campaignId = response!.id;

    const orgId = response!.organization;

    const pagination = {
      page: 1,
      limit: 10,
      search: "YES",
    };

    //fetch campaign replies
    const responses = await CampaignResponsesRepository.list(
      orgId,
      pagination,
      campaignId
    );

    const firstResponse = responses.data[0];

    expect(responses.data.length).toBeGreaterThan(0);
    expect(responses.totalDocuments).toBe(1);
    expect(firstResponse.text).toBe("YES");
  });
});
