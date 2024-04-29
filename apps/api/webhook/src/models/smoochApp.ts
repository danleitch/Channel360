import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface SmoochAppAttrs {
  appId: string;
  organization: string;
  name: string;
  appToken: string;
  settings: Object;
  metadata?: Object;
  integrationId?: string;
}

export interface SmoochAppDoc extends mongoose.Document {
  appId: string;
  name: string;
  organization: string;
  appToken: string;
  settings: Object;
  metadata: Object;
  integrationId?: string;
  version: number;
}

interface SmoochAppModel extends mongoose.Model<SmoochAppDoc> {
  build(attrs: SmoochAppAttrs): SmoochAppDoc;
}

const smoochAppSchema = new mongoose.Schema(
  {
    appId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    appToken: {
      type: String,
      required: true,
    },
    settings: {
      type: Object,
      required: true,
    },
    metadata: {
      type: Object,
      required: false,
    },
    integrationId: {
      type: String,
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
smoochAppSchema.set("versionKey", "version");
smoochAppSchema.plugin(updateIfCurrentPlugin);
smoochAppSchema.index({organization: 1});
smoochAppSchema.statics.build = (attrs: SmoochAppAttrs) => {
  return new SmoochApp(attrs);
};

const SmoochApp = mongoose.model<SmoochAppDoc, SmoochAppModel>(
  "SmoochApp",
  smoochAppSchema
);

export { SmoochApp };
