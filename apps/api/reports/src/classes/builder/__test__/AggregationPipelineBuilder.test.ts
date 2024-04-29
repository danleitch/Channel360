import { AggregationPipelineBuilder } from "../AggregationPipelineBuilder";
import mongoose from "mongoose";

describe("AggregationPipelineBuilder", () => {
  it("should correctly add an organization match stage", () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    const builder = new AggregationPipelineBuilder();
    const pipeline = builder.addMatchOrganizationStage(orgId).build();

    expect(pipeline).toEqual([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(orgId),
        },
      },
    ]);
  });

  it("should correctly add a date match stage", () => {
    const startDate = new Date("2023-01-01");
    const endDate = new Date("2023-01-31");
    const builder = new AggregationPipelineBuilder();
    const pipeline = builder.addMatchDateStage(startDate, endDate).build();

    expect(pipeline).toEqual([
      {
        $match: {
          scheduled: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
    ]);
  });
  it("should not add a date match stage if startDate or endDate are undefined", () => {
    const builder = new AggregationPipelineBuilder();
    let pipeline = builder
      .addMatchDateStage(undefined, new Date("2023-01-31"))
      .build();
    expect(pipeline).toEqual([]);

    pipeline = builder
      .addMatchDateStage(new Date("2023-01-01"), undefined)
      .build();
    expect(pipeline).toEqual([]);

    pipeline = builder.addMatchDateStage(undefined, undefined).build();
    expect(pipeline).toEqual([]);
  });

  it("should handle null values for startDate and endDate gracefully", () => {
    const builder = new AggregationPipelineBuilder();
    const pipeline = builder.addMatchDateStage(null!, null!).build();
    expect(pipeline).toEqual([]);
  });

  it("should build an empty pipeline if no stages are added", () => {
    const builder = new AggregationPipelineBuilder();
    const pipeline = builder.build();

    expect(pipeline).toEqual([]);
  });

  it("should combine organization and date match stages correctly", () => {
    const orgId = new mongoose.Types.ObjectId().toString();
    const startDate = new Date("2023-01-01");
    const endDate = new Date("2023-01-31");
    const builder = new AggregationPipelineBuilder();
    const pipeline = builder
      .addMatchOrganizationStage(orgId)
      .addMatchDateStage(startDate, endDate)
      .build();

    expect(pipeline).toEqual([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(orgId),
        },
      },
      {
        $match: {
          scheduled: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
    ]);
  });
});
