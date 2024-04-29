import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface IntegrationAttrs {
  integration_id: string;
  status: string;
  type: string;
  displayName: string;
  accountId: string;
  appId: string;
  phoneNumber: string;
  phoneNumberId: string;
}

export interface IntegrationDoc extends mongoose.Document {
  integration_id: string;
  status: string;
  type: string;
  displayName: string;
  accountId: string;
  appId: string;
  phoneNumber: string;
  phoneNumberId: string;
  version: number;
}

interface IntegrationModel extends mongoose.Model<IntegrationDoc> {
  build(attrs: IntegrationAttrs): IntegrationDoc;
}

const integrationSchema = new mongoose.Schema(
  {
    integration_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    appId: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    phoneNumberId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
integrationSchema.set("versionKey", "version");
integrationSchema.plugin(updateIfCurrentPlugin);

integrationSchema.statics.build = (attrs: IntegrationAttrs) => {
  return new Integration(attrs);
};

const Integration = mongoose.model<IntegrationDoc, IntegrationModel>(
  "Integration",
  integrationSchema
);

export { Integration };
