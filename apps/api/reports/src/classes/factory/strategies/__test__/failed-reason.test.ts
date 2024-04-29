import mongoose from "mongoose";
import { NotificationSeeder } from "@seeders/NotificationSeeder";
import ChartRepository from "@repositories/ChartRepository";

describe("FailedReasonChart", () => {
  it("should successfully build a Failed Reason column chart", async () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    await NotificationSeeder.seed(orgId, 1000);
    const title = "Failed Reasons";
    const strategyKey = "failedReason";

    const chart = await ChartRepository.create({
      title,
      strategyKey,
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
          categories: expect.any(Array),
          series: expect.arrayContaining([
            expect.objectContaining({
              data: expect.any(Array),
            }),
          ]),
        }),
      }),
    );
  });
});
