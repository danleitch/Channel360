import { GroupSubscriber, GroupSubscriberDoc } from "@models/groupSubscriber";
import { BaseRepository } from "./BaseRepository";
import { SubscriberDoc } from "@models/subscriber";
import { IPageRequestArgs } from "@interfaces/IPageArgs";

export class GroupSubscriberRepository extends BaseRepository<GroupSubscriberDoc> {
  constructor() {
    super(GroupSubscriber);
  }

  /**
   * UnAssign subscribers from a group
   * @param groupId
   * @param subscriberIds
   */
  async unAssign(groupId: string, subscriberIds: string[]): Promise<void> {
    await this.model.deleteMany({
      group: groupId,
      subscriber: { $in: subscriberIds },
    });
  }

  /**
   * Assign subscribers to a group
   * @param groupSubscriberId
   * @param subscriberIds
   */
  async assign(
    groupSubscriberId: string,
    subscriberIds: string[]
  ): Promise<GroupSubscriberDoc[]> {
    if (!Array.isArray(subscriberIds)) {
      throw new TypeError("Subscriber IDs must be an array");
    }

    const groupSubscriberData = subscriberIds.map((subscriberId) => ({
      id: groupSubscriberId,
      subscriber: subscriberId,
    }));

    return await this.model.insertMany(groupSubscriberData);
  }

  /**
   * Import subscribers to a group
   * @param orgId
   * @param groupId
   * @param subscriberData
   */
  async importSubscribersToGroup(
    orgId: string,
    groupId: string,
    subscriberData: SubscriberDoc[]
  ) {
    const bulkGroupSubscriberOps = subscriberData.map((subscriber) => ({
      updateOne: {
        filter: { subscriber: subscriber._id, group: groupId },
        update: { $set: { organization: orgId } },
        upsert: true,
      },
    }));

    if (bulkGroupSubscriberOps.length > 0) {
      await this.model.bulkWrite(bulkGroupSubscriberOps, { ordered: false });
    }
  }

  /**
   * Lists subscribers in a group
   * @param groupId
   * @param pagination
   */
  async listGroupSubscribers(
    groupId: string,
    pagination?: IPageRequestArgs
  ): Promise<{
    totalDocuments: number;
    totalPages: number;
    data: GroupSubscriberDoc[];
  }> {
    if (!pagination) {
      throw new Error("Pagination parameters are required.");
    }

    const { page, limit } = pagination;

    if (page <= 0 || limit <= 0) {
      throw new Error("Page and limit parameters must be greater than zero.");
    }

    const skip = (page - 1) * limit;

    const query = { group: groupId };

    const data = (await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate("subscriber")
      .exec()) as GroupSubscriberDoc[];

    const totalDocuments = await this.model.countDocuments(query);

    return {
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
      data,
    };
  }

  /**
   * List groups by subscriber ID
   * @param subscriberId
   * @param pagination
   */
  async listGroupsBySubscriberId(
    subscriberId: string,
    pagination: IPageRequestArgs
  ) {
    const query = { subscriber: subscriberId };

    const documents = await this.model
      .find(query)
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .populate({
        path: "group",
        select: ["name", "description", "enabled", "id"],
      })
      .exec();

    const totalDocuments = await this.model.countDocuments(query);

    const data = documents.map((doc) => ({
      name: doc.group.name,
      description: doc.group.description,
      enabled: doc.group.enabled,
      id: doc.group.id,
    }));

    return {
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / pagination.limit),
      data,
    };
  }
}

export default new GroupSubscriberRepository();
