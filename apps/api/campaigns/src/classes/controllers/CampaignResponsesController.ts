import { Request, Response } from "express";
import { GetSuccess } from "@channel360/core";
import { Parser } from "json2csv";
import { Response as CampaignResponse } from "@models/response";
import { ICampaignResponse } from "@interfaces/IResponse";
import CampaignResponsesRepository from "@repositories/CampaignResponsesRepository";

class CampaignResponseController {
  async list(req: Request, res: Response) {
    const { campaignId, orgId } = req.params;

    const pagination = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: (req.query.search as string) || "",
    };

    const { data, totalDocuments, totalPages } =
      await CampaignResponsesRepository.list(orgId, pagination, campaignId);

    const response = {
      data,
      totalDocuments,
      totalPages,
      currentPage: pagination.page,
    };

    return new GetSuccess(res).send(response);
  }
  async export(req: Request, res: Response): Promise<void> {
    const { campaignId, orgId } = req.params;

    const campaignReplies = (await CampaignResponse.find({
      campaign: campaignId,
      organization: orgId,
    }).populate(["recipient", "campaign"])) as ICampaignResponse[];

    const csvData = campaignReplies.map((reply) => ({
      campaign: reply.campaign.reference,
      mobileNumber: reply.recipient.mobileNumber,
      text: reply.text,
    }));

    const csvParser = new Parser();
    const csv = csvParser.parse(csvData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="campaign-replies.csv"'
    );

    new GetSuccess(res).send(csv);
  }
}

export default new CampaignResponseController();
