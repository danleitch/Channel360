import { app } from "@app";
import request from "supertest";
import { Group } from "@models/group";
import { Organization } from "@models/organization";
import { ImportSubscribersToGroupSeeder } from "@seeders/ImportSubscribersToGroupSeeder";
import { GroupSubscriber } from "@models/groupSubscriber";

describe("Group Subscriber Controller", () => {
  it("should list groups asociated with a subscriber (by Id): Successfully ✅ 👥 ", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const groupSubscriber = await GroupSubscriber.findOne();

    const orgId = groupSubscriber!.organization;
    const subscriberId = groupSubscriber!.subscriber;
    const pagination = {
      page: 1,
      limit: 10,
      search: "",
    };

    const res = await request(app)
      .get(`/webapi/org/${orgId}/groups/subscribers/${subscriberId}`)
      .query(pagination)
      .expect(200);

    expect(res.body.data).toBeDefined();
  });

  it("should get group subscribers", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const groupSubscriber = await GroupSubscriber.findOne();

    const orgId = groupSubscriber!.organization;
    const subscriberId = groupSubscriber!.subscriber;
    const pagination = {
      page: 1,
      limit: 10,
      search: "",
    };

    const res = await request(app)
      .get(`/webapi/org/${orgId}/groups/subscribers/${subscriberId}`)
      .query(pagination)
      .expect(200);

    expect(res.body.data).toBeDefined();
  });

  it("should update an existing group: Successfully ✅ 👥", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const existingGroup = await Group.findOne();
    const groupId = existingGroup!.id;
    const orgId = existingGroup!.organization;

    const updatedGroup = await request(app)
      .put(`/webapi/org/${orgId}/groups/${groupId}`)
      .send({
        name: "Updated Test Group",
        description: "Updated Test Description",
      })
      .expect(200);

    expect(updatedGroup.body).toBe(
      "Group updated successfully: Updated Test Group"
    );
  });
});

describe("Group Subscriber Controller", () => {
  it("should create a new group", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const organization = await Organization.findOne();

    const orgId = organization!.id;

    const res = await request(app)
      .post(`/webapi/org/${orgId}/groups`)
      .send({ name: "Test Group", description: "Test Description" })
      .expect(201);

    expect(res.body.message).toBe("Created Group Successfully");
    expect(res.body.data).toBeDefined();
  });

  it("should update a group", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const group = await Group.findOne();

    const orgId = group!.organization;
    const groupId = group!.id;

    const res = await request(app)
      .put(`/webapi/org/${orgId}/groups/${groupId}`)
      .send({
        name: "Updated Test Group",
        description: "Updated Test Description",
      })
      .expect(200);

    expect(res.body).toBe("Group updated successfully: Updated Test Group");
  });

  it("should delete a group", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const group = await Group.findOne();
    const groupId = group!.id;
    await request(app).delete(`/webapi/org/123/groups/${groupId}`).expect(204);
  });
});
