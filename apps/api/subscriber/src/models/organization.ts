import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { IOrganization } from "@interfaces/IOrganization";

export interface OrganizationDoc extends mongoose.Document {
  name: string;
  users: string[];
  version: number;
}

interface OrganizationModel extends mongoose.Model<OrganizationDoc> {
  build(attrs: IOrganization): OrganizationDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<OrganizationDoc | null>;
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
organizationSchema.set("versionKey", "version");
organizationSchema.plugin(updateIfCurrentPlugin);

organizationSchema.statics.build = (attrs: IOrganization) => {
  return new Organization({
    _id: attrs.id,
    name: attrs.name,
    users: attrs.users,
  });
};

organizationSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Organization.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Organization = mongoose.model<OrganizationDoc, OrganizationModel>(
  "Organization",
  organizationSchema
);

export { Organization };
