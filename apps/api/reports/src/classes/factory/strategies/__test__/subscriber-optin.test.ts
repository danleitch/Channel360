import { SubscriberSeeder } from "@seeders/SubscriberSeeder";
import mongoose from "mongoose";
import ChartRepository from "@repositories/ChartRepository";

describe("Subscriber OptIn/OptOut Chart", () => {
  it("Successfully builds the Subscriber OptIn/OptOut Chart", async () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    await SubscriberSeeder.seed(orgId, 100);

    const title = "OptIn/OptOut";
    const strategyKey = "subscriberOptInStatus";
    const type = "PieChart";

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
            expect.objectContaining({
              label: "Opt In",
              value: expect.any(Number),
            }),
            expect.objectContaining({
              label: "Opt Out",
              value: expect.any(Number),
            }),
          ]),
        }),
      }),
    );
  });
});
