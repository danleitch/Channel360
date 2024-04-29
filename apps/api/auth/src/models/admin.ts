import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Password } from "@channel360/core";

interface AdminAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AdminModel extends mongoose.Model<AdminDoc> {
  build(attrs: AdminAttrs): AdminDoc;
  findByEvent(event: { id: string; version: number }): Promise<AdminDoc | null>;
}

export interface AdminDoc extends mongoose.Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  version: number;
}

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
adminSchema.set("versionKey", "version");
adminSchema.plugin(updateIfCurrentPlugin);
adminSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

adminSchema.statics.build = (attrs: AdminAttrs) => {
  return new Admin(attrs);
};
adminSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Admin.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

adminSchema.statics.build = (attrs: AdminAttrs) => {
  return new Admin(attrs);
};

const Admin = mongoose.model<AdminDoc, AdminModel>("Admin", adminSchema);

export { Admin };
