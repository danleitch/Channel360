import mongoose, { Model } from "mongoose";
import { modelRegistry } from "@models/index";
import { CampaignsDoc } from "@models/campaigns";

export class NotificationSeeder {
  private static get notificationModel() {
    if (!modelRegistry.Notification) {
      throw new Error("Notification model is not initialized.");
    }
    return modelRegistry.Notification;
  }

  public static async seed(orgId: string, notificationsToCreate: number) {
    await this.notificationModel.deleteMany();
    await generateCampaigns();
    for (let i = 0; i < notificationsToCreate; i++) {
      const date = randomeDate();

      const notification = new this.notificationModel({
        category: randomCategory(),
        organization: orgId,
        subscriber: new mongoose.Types.ObjectId().toString(),
        mobileNumber: randomMobileNumber(),
        firstName: randomName(),
        lastName: randomLastName(),
        optInStatus: true,
        conversationId: randomConversationId(),
        reference: randomReference(),
        campaign: await randomCampaign(),
        status: randomStatus(),
        createdAt: date,
        scheduled: date,
        failure_reason: randomFailedReason(),
      });
      await notification.save();
    }
  }
}

const randomStatus = () => {
  // status can be "PENDING", "DELIVERED", "READ", or "FAILED"

  const statuses = [
    "PENDING",
    "DELIVERED",
    "READ",
    "FAILED",
    "DELIVERED TO CHANNEL",
    "SUBMITTED",
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const randomCategory = () => {
  // category can be "MARKETING", "SUPPORT", or "SALES"
  const categories = ["MARKETING", "UTILITY", "AUTHENTICATION"];
  return categories[Math.floor(Math.random() * categories.length)];
};

const randomName = () => {
  // name can be "John", "Jane", or "Bob"
  const names = ["John", "Jane", "Bob"];
  return names[Math.floor(Math.random() * names.length)];
};

const randomLastName = () => {
  // lastName can be "Doe", "Smith", or "Jones"
  const lastNames = ["Doe", "Smith", "Jones"];
  return lastNames[Math.floor(Math.random() * lastNames.length)];
};

const randomMobileNumber = () => {
  // mobileNumber can be a 10-digit number
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

const randomReference = () => {
  // reference can be a 10-digit number
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

const randomConversationId = () => {
  // conversationId can be a 10-digit number
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

const randomeDate = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const daysInCurrentMonth = new Date(
    currentYear,
    currentMonth + 1,
    0,
  ).getDate(); // Get the last day of the current month

  const randomDay = Math.floor(Math.random() * daysInCurrentMonth) + 1; // Random day of the month
  const randomHour = Math.floor(Math.random() * 24); // Random hour
  const randomMinute = Math.floor(Math.random() * 60); // Random minute
  const randomSecond = Math.floor(Math.random() * 60); // Random second

  return new Date(
    currentYear,
    currentMonth,
    randomDay,
    randomHour,
    randomMinute,
    randomSecond,
  );
};

const randomFailedReason = () => {
  const failedReasons = [
    "Invalid Number",
    "Invalid Campaign",
    "Invalid Organization",
  ];
  return failedReasons[Math.floor(Math.random() * failedReasons.length)];
};

const generateCampaigns = async () => {
  const campaignsModel = (): Model<CampaignsDoc> => {
    if (!modelRegistry.Campaigns) {
      throw new Error("Campaigns model is not initialized.");
    }
    return modelRegistry.Campaigns as Model<CampaignsDoc>;
  };

  await campaignsModel().deleteMany();

  // Make 3 Campaigns
  const campaign1 = new (campaignsModel())({
    reference: "campaign1",
    scheduled: new Date(), // Now
  });

  // Add 10 minutes to current date for campaign2
  let dateForCampaign2 = new Date();
  dateForCampaign2.setMinutes(dateForCampaign2.getMinutes() + 10);
  const campaign2 = new (campaignsModel())({
    reference: "campaign2",
    scheduled: dateForCampaign2,
  });

  // Add 10 minutes to current date for campaign3
  let dateForCampaign3 = new Date();
  dateForCampaign3.setMinutes(dateForCampaign3.getMinutes() + 20);
  const campaign3 = new (campaignsModel())({
    reference: "campaign3",
    scheduled: dateForCampaign3,
  });

  // Save the Campaigns
  await campaign1.save();
  await campaign2.save();
  await campaign3.save();
};

const randomCampaign = async () => {
  const campaignsModel = (): Model<CampaignsDoc> => {
    if (!modelRegistry.Campaigns) {
      throw new Error("Campaigns model is not initialized.");
    }
    return modelRegistry.Campaigns as Model<CampaignsDoc>;
  };

  // Return a random Campaign\

  const campaigns = await campaignsModel().find().lean();

  // const campaigns = await campaignsModel().find().select("_id").lean()

  const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
  return campaign._id.toString();
};
