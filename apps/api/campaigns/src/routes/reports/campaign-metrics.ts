import express, { Request, Response } from "express";
import { NotFoundError, validateRequest } from "@channel360/core";
import { Notification } from "@models/notification";
import { Organization } from "@models/organization";
import { body } from "express-validator";

const router = express.Router({ mergeParams: true });

router.use(
  [body("status").not().isEmpty().withMessage("status must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log("Requesting notification metrics from campaigns");
    const { startDate, endDate, status, campaignId } = req.body;
    const organization = await Organization.findById(req.params.orgId);

    if (!organization) {
      throw new NotFoundError();
    }

    const querySelector = (statusQuery: string) => {
      if (campaignId) {
        return {
          organization: organization.id,
          campaign: campaignId,
          status: statusQuery,
        };
      } else {
        return {
          organization: organization.id,
          createdAt: { $gte: startDate, $lte: endDate },
          status: statusQuery,
        };
      }
    };

    if (status === "ALL") {
      const notifications = await Promise.all(
        ["PENDING", "DELIVERED TO CHANNEL", "DELIVERED", "READ", "FAILED"].map(
          async (s) => {
            return Notification.countDocuments(querySelector(s));
          }
        )
      );

      console.log("Notifications", notifications);
      return res.send({
        pending: notifications[0],
        outForDelivery: notifications[1],
        delivered: notifications[2],
        read: notifications[3],
        failed: notifications[4],
        total:
          notifications[0] +
          notifications[1] +
          notifications[2] +
          notifications[3] +
          notifications[4],
        totalSent: notifications[2] + notifications[3] + notifications[1],
      });
    }

    const notifications = await Notification.countDocuments(
      querySelector(status)
    );
    res.status(200).json({ notifications: notifications });
  }
);

export { router as campaignMetricsReportRouter };
