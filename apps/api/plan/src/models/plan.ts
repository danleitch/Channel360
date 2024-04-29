import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PlanAttrs {
  title: string;
  term: string;
  price: number;
  description: string;
  includes: string[];
}

interface PlanDoc extends mongoose.Document {
  title: string;
  term: string;
  price: number;
  description: string;
  includes: string[];
  version: number;
}

interface PlanModel extends mongoose.Model<PlanDoc> {
  build(attrs: PlanAttrs): PlanDoc;
}

const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    term: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    includes: {
      type: [String],
      required: false,
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
  }
);
planSchema.set("versionKey", "version");
planSchema.plugin(updateIfCurrentPlugin);

planSchema.statics.build = (attrs: PlanAttrs) => {
  return new Plan(attrs);
};

const Plan = mongoose.model<PlanDoc, PlanModel>("Plan", planSchema);

export { Plan };
