import ChartRepository from "@repositories/ChartRepository";
import mongoose from "mongoose";
import { NotificationSeeder } from "@seeders/NotificationSeeder";

describe("Success/Failed Chart", () => {
  it("Successfully builds Success/Failed Pie Chart", async () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    await NotificationSeeder.seed(orgId, 100);
    const title = "Success/Failed";
    const strategyKey = "successFailed";
    const type = "PieChart"

    const chart = await ChartRepository.create({
      title,
      strategyKey,
      type,
    });

    const pieChart = await ChartRepository.getChartWithMetrics(chart._id, {
      orgId,
    });

    expect(pieChart).toEqual(
      expect.objectContaining({
        type,
        title,
        chart: expect.objectContaining({
          series: expect.arrayContaining([
            expect.objectContaining({ label: "Success", value: expect.any(Number) }),
            expect.objectContaining({ label: "Failed", value: expect.any(Number) }),
          ]),
        }),
      })
    );
  });
});
