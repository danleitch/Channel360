import { ICampaign } from "@interfaces/ICampaign";
import { natsWrapper } from "../../nats-wrapper";
import { IRepository } from "@interfaces/IRepository";
import { IPageRequestArgs, SearchQuery } from "@interfaces/IPageArgs";
import { Campaigns, CampaignsDoc } from "@models/campaigns";
import { BadRequestError, NotFoundError } from "@channel360/core";
import { CampaignDeletedPublisher } from "@publishers/campaign-deleted-publisher";

class CampaignRepository implements IRepository<ICampaign> {
  /**
   * Create a Campaign
   * @param campaignData
   */

  async create(campaignData: ICampaign): Promise<CampaignsDoc> {
    return Campaigns.build(campaignData).save();
  }

  /**
   * List a Campaign
   * @param orgId
   * @param pagination
   */
  async list(
    orgId: string,
    pagination?: IPageRequestArgs
  ): Promise<{
    totalDocuments: number;
    totalPages: number;
    data: ICampaign[];
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
      subscriberGroup: { $exists: true },
    };

    if (search) {
      searchQuery.$or = [
        { reference: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const campaigns = await Campaigns.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .select("reference template status scheduled subscriberGroup created_at color")
      .populate({
        path: "template",
        select: "name description language",
      })
      .populate({
        path: "subscriberGroup",
        select: "name description",
      })
      .sort({ createdAt: -1 })

    const totalDocuments = await Campaigns.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalDocuments / limit);

    return { totalDocuments, totalPages, data: campaigns };
  }

  /**
   * Get a Campaign
   * @param campaignId
   * @param orgId
   */

  async get(campaignId: string, orgId: string): Promise<ICampaign | null> {
    return Campaigns.findOne({
      _id: campaignId,
      organization: orgId,
      subscriberGroup: { $exists: true },
    }).populate("organization template subscriberGroup");
  }

  /**
   * Update a Campaign
   * @param campaignId
   * @param updateFields
   */
  async update(
    campaignId: string,
    updateFields: Partial<ICampaign>
  ): Promise<CampaignsDoc> {
    const campaign = await Campaigns.findById(campaignId);

    if (!campaign) {
      throw new BadRequestError("Campaign not found");
    }

    campaign.set(updateFields);

    await campaign.save();

    return campaign;
  }

  /**
   * Delete a Campaign
   * @param campaignId
   */

  async delete(campaignId: string): Promise<void> {
    // find the campaignId
    const campaign = await Campaigns.findById(campaignId);

    if (!campaign) {
      throw new NotFoundError();
    }

    await new CampaignDeletedPublisher(natsWrapper.client).publish({
      id: campaign.id,
      reference: campaign.reference,
      version: campaign.version,
    });

    await campaign.deleteOne();
  }
}

export default new CampaignRepository();
