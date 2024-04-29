import { Recipient } from "@models/reciepient";
import { Response } from "@models/response";
import { Campaigns } from "@models/campaigns";
import { Notification } from "@models/notification";
import { ISeeder } from "./ISeeder";
import mongoose from "mongoose";
import { Group } from "@models/group";

export class CustomerRepliesSeeder implements ISeeder {
  async seed() {
    // Create a Campaign
    const campaignData = {
      creator: new mongoose.Types.ObjectId(),
      organization: new mongoose.Types.ObjectId(),
      reference: "Testing",
      scheduled: new Date(),
      status: "ENABLED",
      subscriberGroup: new mongoose.Types.ObjectId(),
      template: new mongoose.Types.ObjectId(),
    };

    // Insert campaign
    const campaign = new Campaigns(campaignData);
    await campaign.save();

    const recipientsData = [
      {
        organization: campaignData.organization,
        campaign: campaign._id,
        subscriber: new mongoose.Types.ObjectId(),
        mobileNumber: "27820000000",
        firstName: "John",
        lastName: "Doe",
        optInStatus: true,
        notificationId: new mongoose.Types.ObjectId(),
      },
      {
        organization: campaignData.organization,
        campaign: campaign._id,
        subscriber: new mongoose.Types.ObjectId(),
        mobileNumber: "27820000001",
        firstName: "Jane",
        lastName: "Doe",
        optInStatus: true,
        notificationId: new mongoose.Types.ObjectId(),
      },
    ];

    // Insert recipients
    const recipients = await Recipient.insertMany(recipientsData);

    const groupData = [
      {
        organization: campaignData.organization,
        name: "Group NAME",
        description: "Group Description",
        createdBy: campaignData.creator,
        enabled: true,
        memberCount: 2,
      },
    ];

    await Group.insertMany(groupData);

    // Create and insert responses
    const responses = recipients.map((recipient, index) => {
      return {
        organization: campaignData.organization,
        campaign: campaign._id,
        recipient: recipient._id,
        text: index % 2 === 0 ? "YES" : "NO",
      };
    });

    await Response.insertMany(responses);

    // Create and insert notifications
    const notificationData = recipients.map((recipient) => ({
      category: "Marketing",
      organization: campaignData.organization.toString(),
      subscriber: recipient.subscriber.toString(),
      mobileNumber: recipient.mobileNumber,
      firstName: recipient.firstName,
      lastName: recipient.lastName,
      optInStatus: recipient.optInStatus,
      campaign: campaign._id.toString(),
      scheduled: campaign.scheduled,
      createdAt: campaign.scheduled,
    }));

    await Notification.insertMany(notificationData);
  }
}
