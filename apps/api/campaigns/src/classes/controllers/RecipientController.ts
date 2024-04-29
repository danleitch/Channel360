import { Request, Response } from "express";
import { GetSuccess } from "@channel360/core";
import { Recipient, RecipientDoc } from "@models/reciepient";
import { Parser } from "json2csv";
import RecipientRepository from "@repositories/RecipientRepository";
import { IPageRequestArgs } from "@interfaces/IPageArgs";

class RecipientController {
  async list(req: Request, res: Response) {
    const { campaignId, orgId } = req.params;

    const pagination: IPageRequestArgs = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 50,
      search: (req.query.search as string) || "",
    };

    const { data, totalDocuments, totalPages } = await RecipientRepository.list(
      orgId,
      pagination,
      campaignId,
    );

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

    const recipients = await Recipient.find({
      campaign: campaignId,
      organization: orgId,
    })
      .populate({
        path: "notificationId",
        select: "status",
      })
      .lean()
      .exec();

      const csvData = recipients.map((recipient: RecipientDoc) => {
        const notification = recipient.notificationId;
        return [
          recipient.firstName,
          recipient.lastName,
          recipient.mobileNumber,
          recipient.optInStatus,
          notification ? notification.status : " ",
        ];
      });
      
    csvData.unshift([
      "First Name",
      "Last Name",
      "Mobile Number",
      "Opt In Status",
      "status",
    ]);

    const csv = new Parser().parse(csvData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="recipients.csv"`
    );

    new GetSuccess(res).send(csv);
  }
}

export default new RecipientController();
