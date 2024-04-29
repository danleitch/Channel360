import { ISeeder } from "./ISeeder";
import { Group } from "@models/group";

import mongoose from "mongoose";
import { Organization } from "@models/organization";
import { Subscriber } from "@models/subscriber";
import { GroupSubscriber } from "@models/groupSubscriber";

export class ImportSubscribersToGroupSeeder implements ISeeder {
  async seed() {
    const organization = Organization.build({
      id: new mongoose.Types.ObjectId().toString(),
      name: "Organization",
      users: [],
    });

    await organization.save();
    // Create a Group
    const group = Group.build({
      description: "This is a Dummy Group",
      name: "Dummy Group",
      organization: organization.id,
    });

    await group.save();

    // Insert an Existing Subscriber and assign the subscriber to the group

    const subscriber = Subscriber.build({
      mobileNumber: "+27142199053",
      firstName: "John",
      lastName: "Smith",
      organization: organization._id,
      optInStatus: true,
    });

    await subscriber.save();
    const subscriber2 = Subscriber.build({
      mobileNumber: "+2710000000",
      firstName: "Jane",
      lastName: "Smith",
      organization: organization._id,
      optInStatus: true,
    });

    await subscriber2.save();

    const groupSubscriber = GroupSubscriber.build({
      subscriber: subscriber._id,
      group: group._id,
      organization: organization._id,
    });

    await groupSubscriber.save();
  }
}
