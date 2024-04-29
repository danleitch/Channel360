import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrganizationDoc } from "./organization";
import { RoleDoc } from "./role";
import { UserDoc } from "./user";
interface OrganizationRoleUserAttrs {
  user: UserDoc;
  organization: OrganizationDoc;
  role: RoleDoc;
}

// An interface that describes the properties
// that a User Model has
interface OrganizationRoleUserModel
  extends mongoose.Model<OrganizationRoleUserDoc> {
  build(attrs: OrganizationRoleUserAttrs): OrganizationRoleUserDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<OrganizationRoleUserDoc | null>;
}

// An interface that describes the properties
// that a User Document has
export interface OrganizationRoleUserDoc extends mongoose.Document {
  user: UserDoc;
  organization: OrganizationDoc;
  role: RoleDoc;
  version: number;
}

const organizationRoleUserSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Role",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
organizationRoleUserSchema.set("versionKey", "version");
organizationRoleUserSchema.plugin(updateIfCurrentPlugin);

organizationRoleUserSchema.statics.build = (
  attrs: OrganizationRoleUserAttrs
) => {
  return new OrganizationRoleUser({
    user: attrs.user,
    organization: attrs.organization,
    role: attrs.role,
  });
};

const OrganizationRoleUser = mongoose.model<
  OrganizationRoleUserDoc,
  OrganizationRoleUserModel
>("OrganizationRoleUser", organizationRoleUserSchema);

export { OrganizationRoleUser };
