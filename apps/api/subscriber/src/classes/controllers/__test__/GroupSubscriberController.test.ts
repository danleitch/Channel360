import { app } from "@app";
import request from "supertest";
import mongoose from "mongoose";
import { Subscriber } from "@models/subscriber";
import { GroupSubscriber } from "@models/groupSubscriber";
import { ImportSubscribersToGroupSeeder } from "@seeders/ImportSubscribersToGroupSeeder";

describe("Test Group Subscriber Operations", () => {
  it("should create (Assign) group subscribers", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscriber = Subscriber.build({
      mobileNumber: "+27142199053",
      firstName: "John",
      lastName: "Smith",
      organization: new mongoose.Types.ObjectId().toString(),
      optInStatus: true,
    });
    await subscriber.save();
    const subscriberIds = [subscriber.id];

    const groupSubscriber = await GroupSubscriber.findOne();
    const groupId = groupSubscriber!.group;
    const orgId = groupSubscriber!.organization;

    const response = await request(app)
      .post(`/webapi/org/${orgId}/groups/assign`)
      .send({ subscriberIds, groupId });
    // .expect(201);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Assigned Subscriber(s) Successfully");
  });
  it("should delete (Unassign) group subscribers", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const groupSubscriber = await GroupSubscriber.findOne();

    const groupId = groupSubscriber!.group;
    const subscriberId = groupSubscriber!.subscriber;
    const orgId = groupSubscriber!.organization;

    const response = await request(app)
      .post(`/webapi/org/${orgId}/groups/unassign`)
      .send({ groupId: groupId, subscriberIds: [subscriberId] })
      .expect(204);

    expect(response.status).toBe(204);

    const groupSubscriberAfterUnassign = await GroupSubscriber.findOne({
      subscriberId,
    });

    expect(groupSubscriberAfterUnassign).toBeNull();
  });

  it("should list (search and paginate) groups successfully", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const group = await GroupSubscriber.find();

    const existingOrgId = group[0]!.organization;

    const pagination = {
      page: 1,
      limit: 10,
      search: "Dummy Group",
    };

    const response = await request(app)
      .get(`/webapi/org/${existingOrgId}/groups/`)
      .query(pagination)
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data[0]!.name).toBe(pagination.search);
  });
});
