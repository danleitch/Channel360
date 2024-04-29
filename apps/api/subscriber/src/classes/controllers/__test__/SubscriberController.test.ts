import { app } from "@app";
import request from "supertest";
import { ImportSubscribersToGroupSeeder } from "@seeders/ImportSubscribersToGroupSeeder";
import { Organization } from "@models/organization";
import { Subscriber } from "@models/subscriber";
import { GroupSubscriber } from "@models/groupSubscriber";
import multer from "multer";


multer({ storage: multer.memoryStorage() }).single("file");
describe("Perform Subscriber CRUD Oprations Successfully", () => {
  it("should batch delete subscribers successfully", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscribers = await Subscriber.find();

    const subscriberIds = subscribers[0]!.id;
    const existingOrgId = subscribers[0]!.organization;

    const response = await request(app)
      .delete(`/webapi/org/${existingOrgId}/subscribers`)
      .send({ subscriberIds })
      .expect(204);

    expect(response.body).toStrictEqual({});
  });

  it("should delete subscribers successfully", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscriber = await Subscriber.findOne();

    const existingSubscriberId = subscriber!.id;
    const existingOrgId = subscriber!.organization;

    const response = await request(app)
      .delete(
        `/webapi/org/${existingOrgId}/subscribers/${existingSubscriberId}`
      )
      .send(existingSubscriberId)
      .expect(204);

    expect(response.body).toStrictEqual({});
    const deletedSubscriber = await Subscriber.findById(existingSubscriberId);
    expect(deletedSubscriber).toBeNull;
  });

  it("SHOULD create a Subscriber ", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const organization = await Organization.findOne();

    await request(app)
      .post(`/webapi/org/${organization?._id}/subscribers`)
      .send({
        mobileNumber: "+27142199054",
        firstName: "John",
        lastName: "Smith",
      })
      .expect(201);
  });

  it("SHOULD fail when a creating a duplicate 'mobileNumber' (a subscriber)", async () => {
    await new ImportSubscribersToGroupSeeder().seed();
    const organization = await Organization.findOne();

    await request(app)
      .post(`/webapi/org/${organization?._id}/subscribers`)
      .send({
        mobileNumber: "+27142199053",
        firstName: "John",
        lastName: "Smith",
      })
      .expect(400);
  });

  it("should get subscriber by Id successfully", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscriber = await Subscriber.findOne();

    const existingSubscriberId = subscriber!.id;
    const existingOrgId = subscriber!.organization;

    const response = await request(app)
      .get(`/webapi/org/${existingOrgId}/subscribers/${existingSubscriberId}`)
      .expect(200);

    expect(response.body!.firstName).toBe("John");
    expect(response.body.groups.data).toHaveLength(1);
    expect(response.body.groups.data[0].name).toBe("Dummy Group");
  });

  it("should update a subscriber successfully", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscriber = await Subscriber.findOne();

    const existingSubscriberId = subscriber!.id;
    const existingOrgId = subscriber!.organization;
    const updatedFields = {
      mobileNumber: "+27700000000",
      firstName: "New First Name",
      lastName: "New Last",
      optInStatus: true,
    };
    const response = await request(app)
      .put(`/webapi/org/${existingOrgId}/subscribers/${existingSubscriberId}`)
      .send(updatedFields)
      .expect(200);

    expect(response.body.message).toBe("Subscriber Updated Successfully");
    expect(response.body.data.firstName).toBe("New First Name");
  });

  it("should list (search and paginate) subscribers successfully", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscribers = await Subscriber.find();

    const existingOrgId = subscribers[0]!.organization;

    const pagination = {
      page: 1,
      limit: 10,
      search: "John",
    };

    const response = await request(app)
      .get(`/webapi/org/${existingOrgId}/subscribers`)
      .query(pagination)
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data[0]!.firstName).toBe(pagination.search);
  });

  it("should delete (Unassign) group subscribers", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const groupSubscriber = await GroupSubscriber.findOne();

    const groupId = groupSubscriber!.group;
    const subscriberId = groupSubscriber!.subscriber;
    const orgId = groupSubscriber!.organization;

    const response = await request(app)
      .post(`/webapi/org/${orgId}/groups/unassign`)
      .send({ groupId, subscriberIds: [subscriberId] })
      .expect(204);

    expect(response.status).toBe(204);
    const groupSubscriberAfterUnassign = await GroupSubscriber.findOne({
      subscriber: subscriberId,
    });
    expect(groupSubscriberAfterUnassign).toBeNull();
  });
});

describe("Export subscribers", () => {
  it("should export subscribers successfully", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const startDate = "2024-01-01";
    const endDate = "2024-03-31";

    const subscribers = await Subscriber.find();
    const orgId = subscribers[0]?.organization;
    if (!orgId) {
      throw new Error("No subscribers found to export.");
    }

    const response = await request(app)
      .get(`/webapi/org/${orgId}/subscribers/export`)
      .query({ startDate, endDate })
      .expect(200);

    const rows = response.text.split("\n");

    expect(rows[0]).toBe("mobileNumber,firstName,lastName,optInStatus");

    expect(rows).toContain("+2710000000,Jane,Smith,true");

    expect(rows).toContain("+27142199053,John,Smith,true");
    
    expect(response.type).toBe("text/csv");
  });
});
