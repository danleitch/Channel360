import ChartRepository from "@repositories/ChartRepository";
import mongoose from "mongoose";
import { NotificationSeeder } from "@seeders/NotificationSeeder";

describe("MessageStatus Chart", () => {
  it("Successfully builds Read/Unread Donut Chart", async () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    await NotificationSeeder.seed(orgId, 100);
    const title = "Message Status";
    const strategyKey = "messageStatus";

    const chart = await ChartRepository.create({
      title,
      strategyKey,
      keyLabel: "Messages",
      type: "DonutChart",
    });

    const donutChart = await ChartRepository.getChartWithMetrics(chart._id, {
      orgId,
    });
    //ts-ignore
    expect(donutChart).toEqual(
      expect.objectContaining({
        type: "DonutChart",
        title,
        chart: expect.objectContaining({
          series: expect.arrayContaining([
            expect.objectContaining({ label: "Read", value: expect.any(Number) }),
            expect.objectContaining({ label: "Unread", value: expect.any(Number) }),
          ]),
        }),
      })
    );
  });
});
