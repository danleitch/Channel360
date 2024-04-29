import { IChartStrategy } from "@interfaces/IChartStratergy";
import { IApexChart } from "@interfaces/IApexChart";
import { modelRegistry } from "@models/index";
import { AggregationPipelineBuilder } from "@builder/AggregationPipelineBuilder";
import { DateTimeValue } from "types/DateTimeValue";
import { capitalizeWords } from "@channel360/core";

export class CampaignPerformanceStrategy implements IChartStrategy {
  async buildChart(params: {
    orgId?: string;
    startDate?: DateTimeValue;
    endDate?: DateTimeValue;
  }): Promise<IApexChart> {
    const searchPipeline = [
      {
        $match: {
          status: { $nin: ["SUBMITTED", "PENDING"] },
        },
      },

      {
        $group: {
          _id: {
            campaign: "$campaign",
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "campaigns", // The name of the collection to join with
          localField: "_id.campaign", // The field from the input documents
          foreignField: "_id", // The field from the documents of the "from" collection
          as: "campaignDetails", // The array field output to contain the join results
        },
      },
      {
        $unwind: "$campaignDetails",
      },
      {
        $group: {
          _id: "$_id.campaign",
          campaignName: { $first: "$campaignDetails.reference" },
          scheduled: { $first: "$campaignDetails.scheduled" },
          statuses: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },
      {
        $sort: { scheduled: 1 },
      },
      {
        $project: {
          _id: 0,
          campaignName: "$campaignName",
          statuses: 1,
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

    const statuses = ["READ", "DELIVERED", "DELIVERED TO CHANNEL", "FAILED"];

    // Construct series
    const categories = [
      ...new Set(results.map((result) => result.campaignName)),
    ];

    // Step 2: Define the statuses you're interested in
    // Step 3: Construct the series data
    const series = statuses.map((status) => {
      // For each status, iterate over categories to find the count of that status for each campaign
      const data = categories.map((categoryName) => {
        // Find the campaign result that matches the categoryName
        const campaignResult = results.find(
          (result) => result.campaignName === categoryName,
        );
        if (!campaignResult) return 0; // If no campaignResult is found, return 0 for this category

        // Find the status object within the campaignResult.statuses array
        const statusObj = campaignResult.statuses.find(
          (s: any) => s.status === status,
        );
        // If found, return its count, otherwise return 0
        return statusObj ? statusObj.count : 0;
      });

      return { name: capitalizeWords(status), data };
    });

    // Final chart structure
    return {
      categories,
      series,
    };
  }
}
