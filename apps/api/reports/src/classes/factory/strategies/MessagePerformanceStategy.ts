import { IChartStrategy } from "@interfaces/IChartStratergy";
import { IApexChart } from "@interfaces/IApexChart";
import { modelRegistry } from "@models/index";
import { AggregationPipelineBuilder } from "@builder/AggregationPipelineBuilder";
import { DateTimeValue } from "types/DateTimeValue";
import { capitalizeWords } from "@channel360/core";

export class MessagePerformanceStategy implements IChartStrategy {
  async buildChart(params: {
    orgId?: string;
    startDate?: DateTimeValue;
    endDate?: DateTimeValue;
  }): Promise<IApexChart> {
    const notAllowedStatuses = ["SUBMITTED", null];

    const searchPipeline = [
      {
        $match: {
          status: { $nin: notAllowedStatuses },
        },
      },
      {
        $project: {
          date: { $dateToString: { format: "%m-%d", date: "$scheduled" } },
          status: 1,
        },
      },
      {
        $group: {
          _id: { date: "$date", status: "$status" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ];

    const pipeline = new AggregationPipelineBuilder()
      .addMatchOrganizationStage(params.orgId)
      .addMatchDateStage(params.startDate, params.endDate)
      .build();

    const model = modelRegistry["Notification"];

    if (!model) {
      throw new Error(`Model Notification is not initialized.`);
    }

    const results = await model.aggregate([...pipeline, ...searchPipeline]);

    // Process results to format for ApexCharts
    const categories = [...new Set(results.map((result) => result._id.date))];

    const seriesData: any = {
      READ: Array(categories.length).fill(0),
      DELIVERED: Array(categories.length).fill(0),
      "DELIVERED TO CHANNEL": Array(categories.length).fill(0),
      FAILED: Array(categories.length).fill(0),
      PENDING: Array(categories.length).fill(0),
    };

    results.forEach((result) => {
      const index = categories.indexOf(result._id.date);
      if (index !== -1) {
        seriesData[result._id.status][index] = result.count;
      }
    });

    const series = Object.keys(seriesData).map((status) => ({
      name: capitalizeWords(status),
      data: seriesData[status],
    }));

    return {
      categories,
      series,
    };
  }
}
