import { IChartStrategy } from "@interfaces/IChartStratergy";
import { DateTimeValue } from "types/DateTimeValue";
import { AggregationPipelineBuilder } from "@builder/AggregationPipelineBuilder";
import { modelRegistry } from "@models/index";

export class NotificationCategoryStrategy implements IChartStrategy {
  async buildChart(params: {
    orgId?: string;
    startDate?: DateTimeValue;
    endDate?: DateTimeValue;
  }) {
    const searchPipeline: any[] = [
      {
        $group: {
          _id: "$category",
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

    const defaultResults: any = { MARKETING: 0, AUTHENTICATION: 0, UTILITY: 0 };
    results.forEach((result) => {
      defaultResults[result._id] = result.count;
    });

    return {
      series: [
        { label: "Marketing", value: defaultResults.MARKETING },
        { label: "Authentication", value: defaultResults.AUTHENTICATION },
        { label: "Utility", value: defaultResults.UTILITY },
      ],
    };
  }
}
