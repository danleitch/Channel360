import { IRecipient } from "@interfaces/IRecipient";
import { IPageRequestArgs, SearchQuery } from "@interfaces/IPageArgs";
import { BadRequestError } from "@channel360/core";
import { NotificationDoc } from "@models/notification";
import { Recipient } from "@models/reciepient";

class RecipientRepository {
  async create(data: IRecipient): Promise<IRecipient> {
    const recipient = Recipient.build(data);
    await recipient.save();
    return recipient as IRecipient;
  }

  async delete(id: string): Promise<void> {
    await Recipient.deleteOne({ _id: id });
  }

  get(id: string, orgId: string): Promise<IRecipient | null> {
    return Recipient.findOne({ _id: id, organization: orgId });
  }

  async list(
    orgId: string,
    pagination?: IPageRequestArgs,
    campaignId?: string
  ): Promise<{
    totalDocuments: number;
    totalPages: number;
    data: IRecipient[];
  }> {
    if (!pagination) {
      throw new BadRequestError("Pagination parameters are required.");
    }

    const { page, limit, search } = pagination;

    if (page <= 0 || limit <= 0) {
      throw new Error("Page and limit parameters must be greater than zero.");
    }

    const skip = (page - 1) * limit;

    const searchQuery: SearchQuery = {
      organization: orgId,
    };
    if (search) {
      searchQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' }},
      ];
    }

    if (campaignId) {
      searchQuery.campaign = campaignId;
    }

    const data = await Recipient.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "notificationId",
        select: "status",
      })

    const totalDocuments = await Recipient.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalDocuments / limit);

    const recipients = data.map((recipient) => {
      const notification =
        recipient.notificationId as unknown as NotificationDoc;
      return {
        id: recipient.id,
        organization: recipient.organization,
        campaign: recipient.campaign,
        subscriber: recipient.subscriber,
        mobileNumber: recipient.mobileNumber,
        firstName: recipient.firstName,
        lastName: recipient.lastName,
        optInStatus: recipient.optInStatus,
        status: notification ? notification.status : "",
      };
    });

    return { totalDocuments, totalPages, data: recipients };
  }

  async update(
    id: string,
    updatedFields: Partial<IRecipient>
  ): Promise<IRecipient> {
    const recipient = await Recipient.findById(id);

    if (!recipient) {
      throw new Error("Recipient not found");
    }

    recipient.set(updatedFields);

    await recipient.save();

    return recipient as IRecipient;
  }
}

export default new RecipientRepository();
