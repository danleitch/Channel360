import { Response as CampaignResponse } from "@models/response";
import { IPageRequestArgs, SearchQuery } from "@interfaces/IPageArgs";
import { BadRequestError } from "@channel360/core";
import { IResponse } from "@interfaces/IResponse";

class CampaignResponsesRepository {
  /**
   * List Campaign Replies
   * @param campaignId
   * @param orgId
   * @param pagination
   */
  async list(
    orgId: string,
    pagination?: IPageRequestArgs,
    campaignId?: string
  ): Promise<{
    totalDocuments: number;
    totalPages: number;
    data: IResponse[];
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
        { text: { $regex: search, $options: 'i' } },
      
      ];
    }

    if (campaignId) {
      searchQuery.campaign = campaignId;
    }
    const data = await CampaignResponse.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("recipient");

    const totalDocuments = await CampaignResponse.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalDocuments / limit);

    return { totalDocuments, totalPages, data: data };
  }
}

export default new CampaignResponsesRepository();
