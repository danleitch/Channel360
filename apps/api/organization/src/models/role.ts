import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface RoleAttrs {
  name: string;
}
interface RoleModel extends mongoose.Model<RoleDoc> {
  build(attrs: RoleAttrs): RoleDoc;
  findByEvent(event: { id: string; version: number }): Promise<RoleDoc | null>;
}

export interface RoleDoc extends mongoose.Document {
  name: string;
  version: number;
}

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
roleSchema.set("versionKey", "version");
roleSchema.plugin(updateIfCurrentPlugin);

roleSchema.statics.build = (attrs: RoleAttrs) => {
  return new Role({
    name: attrs.name,
  });
};

const Role = mongoose.model<RoleDoc, RoleModel>("Role", roleSchema);

export { Role };
