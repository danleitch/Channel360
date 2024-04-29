import ChartRepository from "@repositories/ChartRepository";
import { modelRegistry } from "@models/index";

describe("ChartRepository", () => {
  beforeEach(async () => {
    await modelRegistry.Chart!.deleteMany();
  });

  it("SHOULD create a chart successfully", async () => {
    const title = "Message Stats";
    const strategyKey = "messageStats";

    const chart = await ChartRepository.create({
      title,
      strategyKey,
    });

    expect(chart).toEqual(
      expect.objectContaining({
        strategyKey,
      }),
    );
  });

  it("SHOULD delete a chart successfully", async () => {
    const title = "Message Stats";
    const strategyKey = "messageStats";

    const chart = await ChartRepository.create({
      title,
      strategyKey,
    });

    await ChartRepository.delete(chart.id);

    const deletedChart = await ChartRepository.get(chart.id);

    expect(deletedChart).toBeNull();
  });

  it("SHOULD get a chart successfully", async () => {
    const title = "Message Stats";
    const strategyKey = "messageStats";

    const chart = await ChartRepository.create({
      title,
      strategyKey,
    });

    const fetchedChart = await ChartRepository.get(chart._id);

    expect(fetchedChart.toObject()).toEqual(chart.toObject());
  });

  it("SHOULD list charts successfully", async () => {
    const title = "Message Stats";
    const strategyKey = "messageStats";

    await ChartRepository.create({
      title,
      strategyKey,
    });

    await ChartRepository.create({
      title,
      strategyKey,
    });

    const charts = await ChartRepository.list();
    expect(charts.length).toEqual(2);
  });

  it("SHOULD update a chart successfully", async () => {
    const title = "Message Stats";
    const strategyKey = "messageStats";

    const chart = await ChartRepository.create({
      title,
      strategyKey,
    });

    const updatedChart = await ChartRepository.update(chart.id, {
      title: "Performance",
      strategyKey,
    });

    expect(updatedChart).toEqual(
      expect.objectContaining({
        title: "Performance",
        strategyKey
      }),
    );
  });
});
