import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Settings } from "@models/settings";
import { IOrganization } from "@interfaces/IOrganization";

export interface OrganizationDoc extends mongoose.Document {
  name: string;
  users: string[];
  plan: string;
  settings: string;
  version: number;
}

interface OrganizationModel extends mongoose.Model<OrganizationDoc> {
  build(attrs: IOrganization): Promise<OrganizationDoc>;
}

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    settings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Settings",
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
organizationSchema.set("versionKey", "version");
organizationSchema.plugin(updateIfCurrentPlugin);
organizationSchema.index({ name: 1 }, { unique: true });

organizationSchema.statics.build = async (attrs: IOrganization): Promise<OrganizationDoc> => {
  const settings = await new Settings().save();
  return new Organization({
    ...attrs,
    settings: settings._id,
  });
};

const Organization = mongoose.model<OrganizationDoc, OrganizationModel>(
  "Organization",
  organizationSchema,
);

export { Organization };
