import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PlanAttrs {
  id: string;
  title: string;
  term: string;
  price: number;
  description: string;
  includes: string[];
}

export interface PlanDoc extends mongoose.Document {
  title: string;
  term: string;
  price: number;
  description: string;
  includes: string[];
  version: number;
}

interface PlanModel extends mongoose.Model<PlanDoc> {
  build(attrs: PlanAttrs): PlanDoc;
  findByEvent(event: { id: string; version: number }): Promise<PlanDoc | null>;
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

planSchema.pre("save", function (done) {
  // @ts-ignore
  this.$where = {
    version: this.get("version") - 1,
  };
  done();
});
planSchema.statics.build = (attrs: PlanAttrs) => {
  return new Plan({
    _id: attrs.id,
    title: attrs.title,
    term: attrs.term,
    price: attrs.price,
    description: attrs.description,
    includes: attrs.includes,
  });
};

planSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Plan.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
const Plan = mongoose.model<PlanDoc, PlanModel>("Plan", planSchema);

export { Plan };
