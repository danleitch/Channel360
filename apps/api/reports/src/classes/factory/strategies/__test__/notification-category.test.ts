import mongoose from "mongoose";
import { NotificationSeeder } from "@seeders/NotificationSeeder";
import ChartRepository from "@repositories/ChartRepository";

describe("Notification Category Chart", () => {
  it("should render the notification category chart", async () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    await NotificationSeeder.seed(orgId, 100);
    const title = "Notification Category Chart";
    const strategyKey = "notificationCategory";

    const chart = await ChartRepository.create({
      title,
      strategyKey,
      keyLabel: "Notification Categories",
      type: "ColumnChart",
    });

    const columnChart = await ChartRepository.getChartWithMetrics(chart._id, {
      orgId,
    });

    expect(columnChart).toEqual(
      expect.objectContaining({
        type: "ColumnChart",
        title,
        chart: expect.objectContaining({
          series: expect.arrayContaining([
            expect.objectContaining({
              label: "Marketing",
              value: expect.any(Number),
            }),
            expect.objectContaining({
              label: "Authentication",
              value: expect.any(Number),
            }),
            expect.objectContaining({
              label: "Utility",
              value: expect.any(Number),
            }),
          ]),
        }),
      }),
    );
  });
});
