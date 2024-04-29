import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ISmoochApp } from "@interfaces/ISmoochApp";

export interface SmoochAppDoc extends mongoose.Document {
  appId: string;
  name: string;
  organization: string;
  appToken: string;
  settings: object;
  metadata: object;
  integrationId?: string;
  version: number;
}

interface SmoochAppModel extends mongoose.Model<SmoochAppDoc> {
  build(attrs: ISmoochApp): SmoochAppDoc;
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
smoochAppSchema.index({ organization: 1 });
smoochAppSchema.statics.build = (attrs: ISmoochApp) => {
  return new SmoochApp(attrs);
};

smoochAppSchema.statics.build = (attrs: ISmoochApp) => {
  return new SmoochApp({
    _id: attrs.id,
    appId: attrs.appId,
    name: attrs.name,
    organization: attrs.organization,
    appToken: attrs.appToken,
    settings: attrs.settings,
    metadata: attrs.metadata,
    integrationId: attrs.integrationId,
  });
};
smoochAppSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return SmoochApp.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const SmoochApp = mongoose.model<SmoochAppDoc, SmoochAppModel>(
  "SmoochApp",
  smoochAppSchema
);

export { SmoochApp };
