import express, { Request, Response } from "express";
import { Parser } from "json2csv";
import { modelRegistry } from "@models/index";

const router = express.Router({ mergeParams: true });

router.use(async (req: Request, res: Response) => {
  const orgId = req.params.orgId;
  const { startDate, endDate, downloadable } = req.body;

  const notificationModel = () => {
    if (!modelRegistry.Notification) {
      throw new Error("Notification model is not initialized.");
    }
    return modelRegistry.Notification;
  }

  const notifications = await Promise.all(
    ["PENDING", "DELIVERED TO CHANNEL", "DELIVERED", "READ", "FAILED"].map(
      async (s) => {
        return notificationModel().countDocuments({
          organization: orgId,
          updatedAt: {
            $gte: startDate,
            $lte: endDate
          },
          status: s,
        });
      }
    )
  );

  const notificationMetrics = {
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
  };

  // EXPORT TO CSV
  if (downloadable) {
    const fields = [
      "notifications.pending",
      "notifications.outForDelivery",
      "notifications.delivered",
      "notifications.read",
      "notifications.failed",
      "notifications.total",
    ];

    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse({
      notificationMetrics: notificationMetrics,
    });

    res.setHeader(
      "Content-disposition",
      `attachment; filename=reports-${orgId}.csv`
    );
    res.set("Content-Type", "text/csv");
    return res.status(200).send(csv);
  }
  res.send({
    notificationMetrics: notificationMetrics || {},
  });
});

export { router as webApiReportsRouter };
