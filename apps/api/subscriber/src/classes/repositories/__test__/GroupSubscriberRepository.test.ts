import mongoose from "mongoose";
import { Subscriber } from "@models/subscriber";
import GroupSubscriberRepository from "@repositories/GroupSubscriberRepository";
import { ImportSubscribersToGroupSeeder } from "@seeders/ImportSubscribersToGroupSeeder";
import { GroupSubscriber } from "@models/groupSubscriber";

describe("Test Group Subscriber Operations", () => {
  it("should (Assign) group subscribers", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscriber = Subscriber.build({
      mobileNumber: "+27142199053",
      firstName: "John",
      lastName: "Smith",
      organization: new mongoose.Types.ObjectId().toString(),
      optInStatus: true,
    });
    await subscriber.save();

    const group = await GroupSubscriber.findOne();
    const groupId = group!.id;

    const createdGroupSubscribers = await GroupSubscriberRepository.assign(
      groupId,
      [subscriber!.id]
    );

    expect(createdGroupSubscribers).toBeTruthy();
  });

  it("should (Unassign) one or more group subscribers", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const group = await GroupSubscriber.findOne();
    const groupId = group!.group;
    const subscriberIds = group!.subscriber;

    const deletedGroupSubscriber = await GroupSubscriberRepository.unAssign(
      groupId,
      [subscriberIds]
    );

    expect(deletedGroupSubscriber).toBeUndefined();

    const remainingGroupSubscriber = await GroupSubscriber.findOne({
      subscriber: subscriberIds,
      group: groupId,
    });
    expect(remainingGroupSubscriber).toBeNull();
  });

  it("should list groups asociated with a subscriber (by Id): Successful ✅ 👥 ", async () => {
    await new ImportSubscribersToGroupSeeder().seed();
    const subscriber = await Subscriber.findOne();
    const subscriberId = subscriber!.id;

    const pagination = {
      page: 1,
      limit: 10,
      search: "",
    };

    const groups = await GroupSubscriberRepository.listGroupsBySubscriberId(
      subscriberId,
      pagination
    );

    expect(groups.data).toBeDefined();
    expect(groups.totalDocuments).toBeGreaterThan(0);
    expect(groups.totalPages).toBeGreaterThan(0);
  });
});
