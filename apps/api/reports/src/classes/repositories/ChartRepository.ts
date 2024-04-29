import { BadRequestError } from "@channel360/core";
import { IChart } from "@interfaces/IChart";
import { modelRegistry } from "@models/index";
import { ChartDoc } from "@models/chart";
import { ChartFactory } from "@factory/ChartFactory";
import { IChartResponse } from "@interfaces/IChartResponse";
import { DateTimeValue } from "types/DateTimeValue";
import { ChartBuilder } from "@builder/ChartBuilder";

export interface IRepository<T> {
  list(orgId: string): Promise<T[]>;

  get(id: string): Promise<T | null>;

  create(chart: T): Promise<T>;

  update(id: string, chart: T): Promise<T>;

  delete(id: string): Promise<void>;
}

class ChartRepository implements IRepository<IChart> {
  private get chartModel() {
    if (!modelRegistry.Chart) {
      throw new Error("Chart model is not initialized.");
    }
    return modelRegistry.Chart;
  }

  /**
   * Create a new chart
   * @param chartData
   */
  async create(chartData: IChart): Promise<ChartDoc> {
    const chart = new this.chartModel(chartData);
    return chart.save();
  }

  /**
   * Delete a chart
   * @param id
   */

  async delete(id: string) {
    await this.chartModel.deleteOne({ _id: id });
  }

  /**
   * Get a Chart
   * @param id
   */

  async get(id: string) {
    return this.chartModel.findById(id);
  }

  /**
   * Get a Chart With Metrics
   * @param id
   * @param params
   */

  async getChartWithMetrics(
    id: string,
    params: {
      orgId?: string;
      startDate?: DateTimeValue;
      endDate?: DateTimeValue;
    },
  ): Promise<IChartResponse> {
    const chart = await this.chartModel
      .findById(id)
      .select(
        "colors chart title description type keyLabel percentageOf strategyKey",
      );

    if (!chart) {
      throw new Error("Chart not found");
    }

    const chartFactory = new ChartFactory();
    const strategy = chartFactory.getStrategy(chart.strategyKey);
    const chartData = await strategy.buildChart(params);

    return new ChartBuilder(chart.title, chart.type)
      .setDescription(chart.description)
      .setKeyLabel(chart.keyLabel)
      .setPercentageOf(chart.percentageOf)
      .setChartData(chartData)
      .setColors(chart.colors)
      .build();
  }

  /**
   * List Charts
   */
  async list() {
    return this.chartModel.find().select("id title type index").sort({
      index: 1,
    });
  }

  /**
   * Update a Chart
   * @param id
   * @param chart
   */
  async update(id: string, chart: IChart) {
    const existingChart = await this.chartModel.findById(id);

    if (!existingChart) {
      throw new BadRequestError("Chart not found");
    }

    existingChart.set(chart);
    await existingChart.save();

    return existingChart;
  }
}
export default new ChartRepository();
