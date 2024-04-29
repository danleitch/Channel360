import { IChartStrategy } from "@interfaces/IChartStratergy";
import { AggregationPipelineBuilder } from "@builder/AggregationPipelineBuilder";
import { modelRegistry } from "@models/index";
import { DateTimeValue } from "types/DateTimeValue";

export class SubscriberOptInStrategy implements IChartStrategy {
  async buildChart(params: {
    orgId?: string;
    startDate?: DateTimeValue;
    endDate?: DateTimeValue;
  }) {
    const searchPipeline: any[] = [
      {
        $group: {
          _id: "$optInStatus",
          count: { $sum: 1 },
        },
      },
    ];

    const pipeline = new AggregationPipelineBuilder()
      .addMatchOrganizationStage(params.orgId)
      .addMatchUpdateAtDateStage(params.startDate, params.endDate)
      .build();

    const model = modelRegistry["Subscriber"];

    if (!model) {
      throw new Error(`Model Notification is not initialized.`);
    }

    const results = await model.aggregate([...pipeline, ...searchPipeline]);

    let optInCount = 0;
    let optOutCount = 0;

    // Process aggregation results
    results.forEach(group => {
      if (group._id === true) {
        optInCount = group.count;
      } else if (group._id === false) {
        optOutCount = group.count;
      }
    });

    // Map to desired structure
    const mappedResult = {
      OptIn: optInCount,
      OptOut: optOutCount,
    };

    return {
      series: [
        { label: "Opt In", value: mappedResult.OptIn },
        { label: "Opt Out", value: mappedResult.OptOut },
      ],
    };
  }
}
