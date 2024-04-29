import mongoose from "mongoose";
import { Templates } from "@models/templates";
import CampaignRepository from "@repositories/CampaignRepository";
import { CustomerRepliesSeeder } from "@seeders/CustomerRepliesSeeder";
import { Campaigns } from "@models/campaigns";

jest.mock("../../../nats-wrapper.ts");
jest.mock("../../../subscriber-service.ts");

describe("Test Campaign Repository CRUD Operations", () => {
  const subscriberGroup = new mongoose.Types.ObjectId().toString();

  it("SHOULD create campaigns successfully", async () => {
    const organization = await global.createOrganization();

    const template = Templates.build({
      id: new mongoose.Types.ObjectId().toString(),
      organization: organization.id,
      name: "TestTemplate",
      description: "Test Description for a test template",
      namespace: "TestNamespace",
      language: "en-US",
      category: "MARKETING",
      components: [
        {
          type: "HEADER",
          format: "TEXT",
          text: "QA TESTING ALERT!!",
        },
        {
          type: "BODY",
          text: "This is a test template with no merge tags and CTA Button to our Staging Environment. ",
        },
        {
          type: "FOOTER",
          text: "(C) Channel Mobile Team. Stop to optout. ",
        },
      ],
    });

    await template.save();

    const campaignData = {
      organization: organization.id,
      reference: "test1",
      template: template.id,
      creator: new mongoose.Types.ObjectId().toString(),
      scheduled: new Date(),
      subscriberGroup: subscriberGroup,
      status: "enabled",
    };

    const expectedColor = "#fff";

    // create campaign
    const campaignCreated = await CampaignRepository.create(campaignData);

    expect(campaignData.reference).toEqual(campaignCreated.reference);
    expect(campaignCreated.color).toBe(expectedColor);
  });

  it("SHOULD Delete a campaign (by Id) successfully", async () => {
    // Create an organization for testing
    const organization = await global.createOrganization();

    // Create a template for testing
    const template = Templates.build({
      id: new mongoose.Types.ObjectId().toString(),
      organization: organization.id,
      name: "TestTemplate",
      description: "Test Description for a test template",
      namespace: "TestNamespace",
      language: "en-US",
      category: "MARKETING",
      components: [
        {
          type: "HEADER",
          format: "TEXT",
          text: "QA TESTING ALERT!!",
        },
        {
          type: "BODY",
          text: "This is a test template with no merge tags and CTA Button to our Staging Environment. ",
        },
        {
          type: "FOOTER",
          text: "(C) Channel Mobile Team. Stop to optout. ",
        },
      ],
    });

    await template.save();

    const campaignData = {
      organization: organization.id,
      reference: "test3",
      template: template.id,
      creator: new mongoose.Types.ObjectId().toString(),
      scheduled: new Date(),
      subscriberGroup: subscriberGroup,
      status: "enabled",
    };

    // Create a campaign
    const campaign = await CampaignRepository.create(campaignData);
    await campaign.save();

    const campaignId = campaign.id;
    campaign.color;

    // Delete the campaign
    await CampaignRepository.delete(campaign.id);

    const deletedCampaign = await CampaignRepository.get(
      campaignId,
      organization.id
    );

    expect(deletedCampaign).toBeNull();
  });

  it("should update a campaign successfully", async () => {
    await new CustomerRepliesSeeder().seed();

    const campaign = await Campaigns.findOne();
    const campaignId = campaign!.id;

    // Update fields for the campaign
    const updatedFields = {
      status: "active",
      scheduled: new Date("2024-04-01"),
      reference: "New Updated Reference",
    };

    // Call the update method
    const updatedCampaign = await CampaignRepository.update(
      campaignId,
      updatedFields
    );

    //campaign from the database
    const fetchedCampaign = await Campaigns.findById(campaignId);

    // Assert that the campaign was updated successfully
    expect(updatedCampaign).toBeDefined();
    expect(updatedCampaign.id).toEqual(campaignId);
    expect(updatedCampaign.status).toEqual(updatedFields.status);
    expect(updatedCampaign.scheduled).toEqual(updatedFields.scheduled);

    //Check if campaign in DB matches the updated fields
    expect(fetchedCampaign).toBeDefined();
    expect(fetchedCampaign!.id).toEqual(campaignId);
    expect(fetchedCampaign!.status).toEqual(updatedFields.status);
    expect(fetchedCampaign!.scheduled.toISOString()).toEqual(
      updatedFields.scheduled.toISOString()
    );
    expect(fetchedCampaign!.reference).toEqual(updatedFields.reference);
  });

  it("SHOULD get a campaign (by Id) successfully", async () => {
    await new CustomerRepliesSeeder().seed();

    const campaign = await Campaigns.findOne();
    const campaignId = campaign!.id;
    const orgId = campaign!.organization;

    const retrievedCampaign = await CampaignRepository.get(campaignId, orgId);

    expect(retrievedCampaign?.reference).toBe("Testing");
    expect(retrievedCampaign?.status).toBe("ENABLED");
    expect(retrievedCampaign?.scheduled.toISOString()).toBe(
      campaign!.scheduled.toISOString()
    );
  });

  it("should list campaigns successfully", async () => {
    await new CustomerRepliesSeeder().seed();

    const campaign = await Campaigns.findOne();
    const orgId = campaign?.organization || "";

    // Set up pagination parameters
    const pagination = {
      page: 1,
      limit: 10,
      search: "",
    };


    // Call the listResponse method
    const result = await CampaignRepository.list(
      orgId,
    pagination
    );

    expect(result.data).toBeDefined();
    expect(result.totalDocuments).toBeGreaterThan(0);
    expect(result.totalPages).toBe(pagination.page);
    expect(result.data.length).toBeGreaterThanOrEqual(0);

  });

  it("should search and paginate campaigns successfully", async () => {
    await new CustomerRepliesSeeder().seed();

    const campaign = await Campaigns.findOne();
    const orgId = campaign?.organization || "";

    // Set up pagination parameters
    const pagination = {
      page: 1,
      limit: 10,
      search: "Testing",
    };

    // Call the listResponse method
    const result = await CampaignRepository.list(orgId, pagination);

    expect(result.data).toBeDefined();
    expect(result.totalDocuments).toBeGreaterThan(0);
    expect(result.totalPages).toBe(pagination.page);
    expect(result.data.length).toBeGreaterThanOrEqual(0);
  });
});
