import { IChartStrategy } from "@interfaces/IChartStratergy";
import { AggregationPipelineBuilder } from "@builder/AggregationPipelineBuilder";
import { modelRegistry } from "@models/index";
import { DateTimeValue } from "types/DateTimeValue";

export class MessageStatsStrategy implements IChartStrategy {
  async buildChart(params: {
    orgId?: string;
    startDate?: DateTimeValue;
    endDate?: DateTimeValue;
  }) {
    const searchPipeline: any[] = [
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
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

    const defaultResults: any = {
      READ: 0,
      DELIVERED: 0,
      "DELIVERED TO CHANNEL": 0,
      FAILED: 0,
      PENDING: 0,
    };
    results.forEach((result) => {
      defaultResults[result._id] = result.count;
    });

    return {
      categories: [
        "Read",
        "Delivered",
        "Delivered To Channel", //@Todo update all "OUT FOR DELIVERY" to "Delivered to Channel"
        "Failed",
        "Pending",
      ],
      series: [
        {
          name: "Messages",
          data: [
            defaultResults.READ,
            defaultResults.DELIVERED,
            defaultResults["DELIVERED TO CHANNEL"],
            defaultResults.FAILED,
            defaultResults.PENDING,
          ],
        },
      ],
    };
  }
}
