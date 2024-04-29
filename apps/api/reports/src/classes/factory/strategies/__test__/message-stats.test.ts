import ChartRepository from "@repositories/ChartRepository";
import mongoose from "mongoose";
import { NotificationSeeder } from "@seeders/NotificationSeeder";

describe("MessageStats Chart", () => {
  it("Successfully builds Read/Unread Donut Chart", async () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    await NotificationSeeder.seed(orgId, 100);
    const title = "Message Stats";
    const strategyKey = "messageStats";

    const chart = await ChartRepository.create({
      title,
      strategyKey,
      keyLabel: "Message Stats",
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
          categories: expect.arrayContaining([
            "Read",
            "Delivered",
            "Delivered To Channel",
            "Failed",
            "Pending",
          ]),
          series: expect.arrayContaining([
            expect.objectContaining({
              data: expect.arrayContaining([
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
              ]),
            }),
          ]),
        }),
      }),
    );
  });
});
