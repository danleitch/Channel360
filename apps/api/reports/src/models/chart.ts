import mongoose from "mongoose";
import { IChart } from "@interfaces/IChart";

interface ChartDoc extends mongoose.Document, IChart {
  title: string;
  strategyKey: string;
  description?: string;
  type?: string;
  keyLabel?: string;
  percentageOf?: string;
  colors?: string[];
  index?: number;
}

const chartSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
    },
    keyLabel: {
      type: String,
    },
    percentageOf: {
      type: String,
    },
    colors: {
      type: [String],
    },
    strategyKey: {
      type: String,
      enum: [
        "messageStats",
        "successFailed",
        "messageStatus",
        "messagePerformance",
        "subscriberOptInStatus",
        "notificationCategory",
        "failedReason",
        "campaignPerformance",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

export { chartSchema, ChartDoc };
