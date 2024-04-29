import { IChartStrategy } from "@interfaces/IChartStratergy";
import { IApexChart } from "@interfaces/IApexChart";
import { modelRegistry } from "@models/index";
import { AggregationPipelineBuilder } from "@builder/AggregationPipelineBuilder";
import { DateTimeValue } from "types/DateTimeValue";
import { shortenFailureReason } from "@helpers/shortenFailureReason";

export class FailedReasonStrategy implements IChartStrategy {
  async buildChart(params: {
    orgId?: string;
    startDate?: DateTimeValue;
    endDate?: DateTimeValue;
  }): Promise<IApexChart> {
    const searchPipeline = [
      {
        $group: {
          _id: {
            $ifNull: ["$failure_reason", "Unknown Reason"],
          },
          count: { $sum: 1 },
        },
      },
    ];

    const pipeline = new AggregationPipelineBuilder()
      .addMatchOrganizationStage(params.orgId)
      .addMatchDateStage(params.startDate, params.endDate)
      .addMatch({ failure_reason: { $ne: null } })
      .build();

    const model = modelRegistry["Notification"];

    if (!model) {
      throw new Error(`Model Notification is not initialized.`);
    }

    const results = await model.aggregate([...pipeline, ...searchPipeline]);

    const processedResults = results.map(result => ({
      ...result,
      _id: shortenFailureReason(result._id),
    }));

    const categories = processedResults.map(result => result._id);

    const series = [
      {
        name: "Failed Reasons",
        data: processedResults.map((result) => result.count),
      },
    ];

    return {
      categories,
      series,
    };
  }
}
