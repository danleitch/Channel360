import { Notification } from "@models/notification";
import express, { Request, Response } from "express";

const router = express.Router({ mergeParams: true });
router.use(async (_req: Request, res: Response) => {
  /* Get How Many Notifications where created each hour for the past 24 hours*/
  /* Notifications: [{hour: count}]*/
  const date = new Date();
  const notifications = await Notification.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(date.getTime() - 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: { $hour: "$createdAt" },
        docs: { $push: "$$ROOT" },
      },
    },
  ]);

  /* Take notifications and reduce them to {hour: count}*/
  const notificationsByHour = notifications.reduce((acc, curr) => {
    acc[curr._id] = curr.docs.length;
    return acc;
  }, {});

  res.send({
    notificationsByHour,
  });
});

export { router as notificationsAdminReportRouter };
