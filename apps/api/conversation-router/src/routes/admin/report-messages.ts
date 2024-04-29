import express, { Request, Response } from "express";
import { validateRequest } from "@channel360/core";
import { body } from "express-validator";
import { Notification } from "@models/notification";

export const dateRangerHelper = (start: any, end: any) => {
  const startDate = new Date(new Date(start).setHours(0, 0, 0));
  const endDate = new Date(new Date(end).setHours(23, 59, 59));

  return { startDate, endDate };
};

const router = express.Router({mergeParams: true});

router.use(
  [
    body("start").not().isEmpty().withMessage("Start date is required"),
    body("end").not().isEmpty().withMessage("End date is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let reportQuery: any = {};
    const { start, end, campaignId } = req.body;
    // create a plan

    if (req.body.orgId) {
      reportQuery.organizationId = req.body.orgId;
    }

    if (req.body.campaignId) {
      reportQuery.campaignId = campaignId;
    }

    const { startDate, endDate } = dateRangerHelper(start, end);

    reportQuery.createdAt = {
      $gte: startDate,
      $lt: endDate,
    };

    const report: any = {};

    console.log(reportQuery);

    //notifications by status
    report.groupByStatus = await Notification.aggregate([
      { $match: reportQuery },
      {
        $group: {
          _id: "$status",
          numberOfMessages: { $sum: 1 },
        },
      },
    ]);

    //notifications by campaign

    report.groupByCampaign = await Notification.aggregate([
      { $match: reportQuery },
      {
        $group: {
          _id: "$campaignId",
          numberOfMessages: { $sum: 1 },
        },
      },
    ]);

    report.notificationsSent = await Notification.find(reportQuery);

    res.status(201).send(report);
  }
);

export { router as reportMessagesRouter };
