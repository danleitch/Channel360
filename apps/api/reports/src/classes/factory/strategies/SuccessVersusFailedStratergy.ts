import { IChartStrategy } from "@interfaces/IChartStratergy";
import { AggregationPipelineBuilder } from "@builder/AggregationPipelineBuilder";
import { modelRegistry } from "@models/index";
import { DateTimeValue } from "types/DateTimeValue";

export class SuccessVersusFailedStratergy implements IChartStrategy {
  async buildChart(params: {
    orgId?: string;
    startDate?: DateTimeValue;
    endDate?: DateTimeValue;
  }) {
    const searchPipeline: any[] = [
      {
        $match: {
          status: { $in: ["DELIVERED", "READ", "FAILED"] }, // Include only relevant statuses
        },
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                {
                  case: { $in: ["$status", ["DELIVERED", "READ"]] },
                  then: "Success",
                },
                { case: { $eq: ["$status", "FAILED"] }, then: "Failed" },
              ],
              default: "Unknown",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          label: "$_id",
          value: "$count",
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

    const defaultResults: any = { Success: 0, Failed: 0 };
    results.forEach((result) => {
      defaultResults[result.label] = result.value;
    });

    return {
      series: [
        { label: "Success", value: defaultResults.Success },
        { label: "Failed", value: defaultResults.Failed },
      ],
    };
  }
}
