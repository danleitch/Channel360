import mongoose from "mongoose";
import ChartRepository from "@repositories/ChartRepository";
import { NotificationSeeder } from "@seeders/NotificationSeeder";

describe("Message Performance Chart", () => {
  it("should successfully build a Message Stats column chart", async () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    await NotificationSeeder.seed(orgId, 20);
    const title = "Message Stats";
    const strategyKey = "messagePerformance";

    const chart = await ChartRepository.create({
      title,
      strategyKey,
      keyLabel: "Message Performance",
      type: "LineChart",
    });

    const startDate = new Date();
    startDate.setDate(1); // Set to the first day of the current month
    startDate.setHours(0, 0, 0, 0); // Set time to the start of the day

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Move to the next month
    endDate.setDate(0); // Set to the last day of the current month by moving back one day from the first day of the next month
    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day

    const lineChart = await ChartRepository.getChartWithMetrics(chart._id, {
      orgId,
      startDate,
      endDate,
    });

    expect(lineChart).toEqual(
      expect.objectContaining({
        type: "LineChart",
        title,
        chart: expect.objectContaining({
          categories: expect.any(Array),
          series: expect.arrayContaining([
            expect.objectContaining({ name: "Read", data: expect.any(Array) }),
            expect.objectContaining({
              name: "Delivered",
              data: expect.any(Array),
            }),
            expect.objectContaining({
              name: "Delivered To Channel",
              data: expect.any(Array),
            }),
            expect.objectContaining({
              name: "Failed",
              data: expect.any(Array),
            }),
            expect.objectContaining({
              name: "Pending",
              data: expect.any(Array),
            }),
          ]),
        }),
      }),
    );
  });
});
