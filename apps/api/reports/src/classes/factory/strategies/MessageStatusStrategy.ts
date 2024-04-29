import { IChartStrategy } from "@interfaces/IChartStratergy";
import { AggregationPipelineBuilder } from "@builder/AggregationPipelineBuilder";
import { modelRegistry } from "@models/index";
import { DateTimeValue } from "types/DateTimeValue";

export class MessageStatusStrategy implements IChartStrategy {
  async buildChart(params: {
    orgId?: string;
    startDate?: DateTimeValue;
    endDate?: DateTimeValue;
  }) {
    const searchPipeline: any[] = [
      {
        $match: {
          status: { $in: ["READ", "DELIVERED"] },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          label: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "READ"] }, then: "Read" },
                { case: { $eq: ["$_id", "DELIVERED"] }, then: "Unread" },
              ],
              default: "Unknown",
            },
          },
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

    const defaultResults: any = { Read: 0, Unread: 0 };
    results.forEach((result) => {
      defaultResults[result.label] = result.value;
    });

    return {
      series: [
        { label: "Read", value: defaultResults.Read },
        { label: "Unread", value: defaultResults.Unread },
      ],
    };
  }
}
