import { Subscriber, SubscriberDoc } from "@models/subscriber";
import { BaseRepository } from "./BaseRepository";
import { csvToJson } from "@helpers/csvToJson";
import { GroupSubscriber } from "@models/groupSubscriber";

export class SubscriberRepository extends BaseRepository<SubscriberDoc> {
  constructor() {
    super(Subscriber);
  }

  async importSubscribers(
    organizationId: string,
    fileBuffer: Buffer,
    groupId?: string
  ) {
    const csvAsJson = await csvToJson(fileBuffer);
    const regex = /^\+?\d{9,}$/;

    const bulkSubscriberOps = [];
    const mobileNumbers = [];

    for (const row of csvAsJson) {
      let mobileNumber = row.mobileNumber;

      if (!mobileNumber.startsWith("+")) {
        mobileNumber = "+" + mobileNumber;
      }

      if (!regex.test(mobileNumber)) {
        continue;
      }

      bulkSubscriberOps.push({
        updateOne: {
          filter: { mobileNumber: mobileNumber, organization: organizationId },
          update: {
            $setOnInsert: {
              organization: organizationId,
              mobileNumber: mobileNumber,
              firstName: row.firstName || "",
              lastName: row.lastName || "",
              optInStatus: true,
            },
          },
          upsert: true,
        },
      });

      mobileNumbers.push(mobileNumber);
    }

    if (bulkSubscriberOps.length > 0) {
      await Subscriber.bulkWrite(bulkSubscriberOps, { ordered: false });
    }

    const subscriberIds = await Subscriber.find({
      mobileNumber: { $in: mobileNumbers },
      organization: organizationId,
    }).select("_id");

    const bulkGroupSubscriberOps = subscriberIds.map((subscriber) => ({
      updateOne: {
        filter: { subscriber: subscriber._id, group: groupId },
        update: { $set: { organization: organizationId } },
        upsert: true,
      },
    }));

    if (bulkGroupSubscriberOps.length > 0) {
      await GroupSubscriber.bulkWrite(bulkGroupSubscriberOps, {
        ordered: false,
      });
    }
  }
}

export default new SubscriberRepository();
