import { app } from "@app";
import request from "supertest";
import mongoose from "mongoose";
import { Campaigns } from "@models/campaigns";
import { Templates } from "@models/templates";
import { Notification } from "@models/notification";
import { CustomerRepliesSeeder } from "@seeders/CustomerRepliesSeeder";

jest.mock("../../../nats-wrapper.ts");
jest.mock("../../../subscriber-service.ts");

describe("Creates different types of campaigns & verifies validation", () => {
  //Generate Scheduled Date for today
  const today = new Date();

  //Create Subscriber Group with one subscriber
  const subscriberGroup = new mongoose.Types.ObjectId().toString();

  it("SHOULD create a campaign with a template with no tags", async () => {
    //Create Organization with user
    const organization = await global.createOrganization();

    //Create Template with Tags
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

    const campaignResponse = await request(app)
      .post(`/webapi/org/${organization.id}/campaigns`)
      .send({
        reference: "test",
        template: template.id,
        creator: new mongoose.Types.ObjectId().toString(),
        scheduled: today,
        subscriberGroup: subscriberGroup,
        status: "enabled",
      })
      .expect(201);

    expect(campaignResponse.status).toBe(201);
  });

  it("SHOULD create a campaign with external merge file tags", async () => {
    //Create Organization with user
    const organization = await global.createOrganization();

    //Create Template with Tags

    const template = Templates.build({
      id: new mongoose.Types.ObjectId().toString(),
      organization: organization.id,
      name: "test_templte",
      description:
        "Test Description for a test template for external merge file",
      namespace: "TestNamespace",
      language: "en-US",
      category: "MARKETING",
      components: [
        {
          type: "HEADER",
          format: "TEXT",
          text: "QA TESTING ALERT!! {{1}}",
        },
        {
          type: "BODY",
          text: "This is a test template with no merge tags and CTA Button to our Staging Environment. {{1}}",
        },
        {
          type: "FOOTER",
          text: "(C) Channel Mobile Team. Stop to optout. ",
        },
      ],
    });

    await template.save();

    const response = await request(app)
      .post(`/webapi/org/${organization.id}/campaigns`)
      .send({
        reference: "test",
        template: template.id,
        creator: new mongoose.Types.ObjectId().toString(),
        scheduled: today,
        subscriberGroup: subscriberGroup,
        status: "enabled",
        tags: {
          head: [
            {
              index: 1,
              type: "csv",
              fields: "AcceptURL",
              url: "2023-06-13T12:18:53.193Z-import.csv",
            },
          ],
          body: [
            {
              index: 1,
              type: "csv",
              fields: "AcceptURL",
              url: "2023-06-13T12:18:53.193Z-import.csv",
            },
          ],
        },
      })
      .expect(201);

    expect(response.status).toBe(201);
  });

  it("SHOULD fail WHEN creating a campaign with invalid tags", async () => {
    //Create Organization with user
    const organization = await global.createOrganization();

    //Create Template with Tags

    const template = Templates.build({
      id: new mongoose.Types.ObjectId().toString(),
      organization: organization.id,
      name: "Test Template with External Merge File",
      description:
        "Test Description for a test template for external merge file",
      namespace: "TestNamespace",
      language: "en-US",
      category: "MARKETING",
      components: [
        {
          type: "HEADER",
          format: "TEXT",
          text: "QA TESTING ALERT!! {{1}}",
        },
        {
          type: "BODY",
          text: "This is a test template with no merge tags and CTA Button to our Staging Environment. {{1}}",
        },
        {
          type: "FOOTER",
          text: "(C) Channel Mobile Team. Stop to optout. ",
        },
      ],
    });

    await template.save();

    const response = await request(app)
      .post(`/webapi/org/${organization.id}/campaigns`)
      .send({
        reference: "test",
        template: template.id,
        creator: new mongoose.Types.ObjectId().toString(),
        scheduled: today,
        subscriberGroup: subscriberGroup,
        status: "enabled",
        tags: {
          head: [
            {
              index: 1,
              type: "badTag",
              fields: "AcceptURL",
              url: "2023-06-13T12:18:53.193Z-import.csv",
            },
          ],
          body: [
            {
              index: 1,
              type: "csv",
              fields: "AcceptURL",
              url: "2023-06-13T12:18:53.193Z-import.csv",
            },
          ],
        },
      })
      .expect(400);

    expect(response.status).toBe(400);
  });

  it("should fail when creating a campaign with scheduled time more than 10 minutes in the past 🕥 🧪", async () => {
    //Create Organization with user
    const organization = await global.createOrganization();

    // set time more than 10 minutes before new Date()
    const scheduledDate = new Date();
    scheduledDate.setMinutes(scheduledDate.getMinutes() - 15);

    // call create template
    const template = Templates.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      organization: organization.id,
      name: "test_template",
      description: "Test Description for a test template",
      namespace: "TestNamespace",
      language: "en-US",
      category: "MARKETING",
      components: [
        {
          type: "HEADER",
          format: "TEXT",
          text: "Text",
        },
        {
          type: "BODY",
          text: "Text",
        },
        {
          type: "FOOTER",
          text: "Text",
        },
      ],
    });

    await template.save();

    const response = await request(app)
      .post(`/webapi/org/${organization.id}/campaigns`)
      .send({
        reference: "test",
        template: template.id,
        creator: new mongoose.Types.ObjectId().toHexString(),
        scheduled: scheduledDate,
        subscriberGroup: subscriberGroup,
        status: "enabled",
      })
      .expect(400);

    expect(response.body.errors[0].message).toBe(
      "Scheduled date must be within the last 10 minutes"
    );
    expect(response.status).toBe(400);
  });
});

describe("Create new campaigns to test 🧪 notifications, scheduled & creation time etc", () => {
  const today = new Date();

  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  const subscriberGroup = new mongoose.Types.ObjectId().toHexString();

  it("should set createdAt time for campaign replies according to scheduled time 🧪", async () => {
    await new CustomerRepliesSeeder().seed();

    const organization = await global.createOrganization();

    // call create template
    const template = Templates.build({
      id: new mongoose.Types.ObjectId().toHexString(),
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

    const campaignResponse = await request(app)
      .post(`/webapi/org/${organization.id}/campaigns`)
      .send({
        reference: "test",
        template: template.id,
        creator: new mongoose.Types.ObjectId().toHexString(),
        scheduled: tomorrow,
        subscriberGroup: subscriberGroup,
        status: "enabled",
      })
      .expect(201);

    //get campaigns scheduled field
    const campaignsScheduledDate = campaignResponse.body.data.scheduled;

    //find notification
    const notification = await Notification.findOne({
      campaign: campaignResponse.body.data.id,
    });

    //find notification scheduled field
    const notificationScheduledDate = notification!.scheduled.toJSON();

    //rounding timestamps to ignore milliseconds difference.
    expect(campaignsScheduledDate).toEqual(notificationScheduledDate);
  });
  it("should fail when creating a campaign with scheduled time more than 10 minutes in the past 🕥 🧪", async () => {
    //Create Organization with user
    const organization = await global.createOrganization();

    // set time more than 10 minutes before new Date()
    const scheduledDate = new Date();
    scheduledDate.setMinutes(scheduledDate.getMinutes() - 15);

    // call create template
    const template = Templates.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      organization: organization.id,
      name: "test_template",
      description: "Test Description for a test template",
      namespace: "TestNamespace",
      language: "en-US",
      category: "MARKETING",
      components: [
        {
          type: "HEADER",
          format: "TEXT",
          text: "Text",
        },
        {
          type: "BODY",
          text: "Text",
        },
        {
          type: "FOOTER",
          text: "Text",
        },
      ],
    });

    await template.save();

    const response = await request(app)
      .post(`/webapi/org/${organization.id}/campaigns`)
      .send({
        reference: "test",
        template: template.id,
        creator: new mongoose.Types.ObjectId().toHexString(),
        scheduled: scheduledDate,
        subscriberGroup: subscriberGroup,
        status: "enabled",
      })
      .expect(400);

    expect(response.body.errors[0].message).toBe(
      "Scheduled date must be within the last 10 minutes"
    );
  });
  it("should ensure notification creation time is within campaign creation time ⏱️ 📧 🧪", async () => {
    await new CustomerRepliesSeeder().seed();

    const organization = await global.createOrganization();

    // call create template
    const template = Templates.build({
      id: new mongoose.Types.ObjectId().toHexString(),
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

    const campaignResponse = await request(app)
      .post(`/webapi/org/${organization.id}/campaigns`)
      .send({
        reference: "test",
        template: template.id,
        creator: new mongoose.Types.ObjectId().toHexString(),
        scheduled: today,
        subscriberGroup: subscriberGroup,
        status: "enabled",
      })
      .expect(201);

    //get campaigns scheduled field
    const campaignsCreatedAt = campaignResponse.body.data.createdAt;

    //find notification scheduled field
    const notification = await Notification.findOne();
    const notificationCreatedAt = notification!.createdAt;

    expect(Math.round(new Date(campaignsCreatedAt).getTime() / 10000)).toBe(
      Math.round(new Date(notificationCreatedAt).getTime() / 10000)
    );
  });
});

describe("Deletes campaigns", () => {
  it("should delete a campaign successfully", async () => {
    await new CustomerRepliesSeeder().seed();

    const campaign = await Campaigns.findOne();
    const campaignId = campaign!.id;
    const orgId = campaign!.organization;

    const response = await request(app)
      .delete(`/webapi/org/${orgId}/campaigns/${campaignId}`)
      .send()
      .expect(204);

    expect(response.body).toStrictEqual({});
    expect(response.status).toBe(204);
  });
});

describe("Get campaigns successfully", () => {
  it("should get a campaign by ID", async () => {
    await new CustomerRepliesSeeder().seed();

    // Find a campaign
    const campaign = await Campaigns.findOne();
    const campaignId = campaign!.id;
    const orgId = campaign!.organization;

    const response = await request(app)
      .get(`/webapi/org/${orgId}/campaigns/${campaignId}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(campaignId);
  });

  it("should list campaigns", async () => {
    await new CustomerRepliesSeeder().seed();

    const campaign = await Campaigns.findOne();

    //get organization associated to a campaign
    const orgId = campaign!.organization;

    // Make request to list campaigns
    const response = await request(app)
      .get(`/webapi/org/${orgId}/campaigns`)
      .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.totalDocuments).toBe(1);
      expect(response.body.totalPages).toBe(1);
      expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should export a CSV file for campaigns🧪", async () => {
    await new CustomerRepliesSeeder().seed();

    // Get campaign id
    const campaign = await Campaigns.findOne();
    const campaignId = campaign!.id;
    const orgId = campaign!.organization;

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
});

describe("Update campaigns successfully", () => {
  it("should update a campaign successfully", async () => {
    await new CustomerRepliesSeeder().seed();

    const campaign = await Campaigns.findOne();
    const campaignId = campaign!.id;
    const orgId = campaign?.organization;

    //request to update campaign
    const response = await request(app)
      .put(`/webapi/org/${orgId}/campaigns/${campaignId}`)
      .send({
        status: "active",
        scheduled: new Date("2024-04-01T00:00:00.000Z"),
      })
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.scheduled).toBe("2024-04-01T00:00:00.000Z");
    expect(response.body.data.status).toBe("active");
  });
});
