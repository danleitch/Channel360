import { Recipient } from "@models/reciepient"; // Correct the import path
import { CustomerRepliesSeeder } from "@seeders/CustomerRepliesSeeder";
import RecipientRepository from "@repositories/RecipientRepository";

describe("Campaign Recipients 🧾 📞 📲", () => {
  it("should return campaign recipients", async () => {
    await new CustomerRepliesSeeder().seed();

    // Get campaign id
    const reciepient = await Recipient.findOne();
    const campaignId = reciepient!.campaign;

    const orgId = reciepient!.organization;

    const pagination = {
      page: 1,
      limit: 10,
      search: "John",
    };

    const recipients = await RecipientRepository.list(
      orgId,
      pagination,
      campaignId
    );

    expect(recipients.data.length).toBeGreaterThan(0);
    expect(recipients.totalDocuments).toBeGreaterThan(0);
    expect(recipients.totalPages).toBeGreaterThan(0);
  });
});
