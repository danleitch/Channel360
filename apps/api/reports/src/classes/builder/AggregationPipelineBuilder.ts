import mongoose from "mongoose";
import { DateTimeValue } from "types/DateTimeValue";

export class AggregationPipelineBuilder {
  private pipeline: any[] = [];

  constructor(private basePipeline: any[] = []) {
    this.pipeline = [...basePipeline];
  }

  addMatchOrganizationStage(orgId?: string) {
    if (orgId) {
      this.pipeline.push({
        $match: {
          organization: new mongoose.Types.ObjectId(orgId),
        },
      });
    }

    return this;
  }

  addMatchDateStage(startDate?: DateTimeValue, endDate?: DateTimeValue) {
    if (startDate && endDate) {
      this.pipeline.push({
        $match: {
          scheduled: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      });
    }
    return this;
  }

  addMatchUpdateAtDateStage(
    startDate?: DateTimeValue,
    endDate?: DateTimeValue,
  ) {
    if (startDate && endDate) {
      this.pipeline.push({
        $match: {
          updatedAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      });
    }
    return this;
  }

  addMatch(match: any) {
    this.pipeline.push({
      $match: match,
    });
    return this;
  }

  build() {
    return this.pipeline;
  }
}
