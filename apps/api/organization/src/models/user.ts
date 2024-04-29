import mongoose from "mongoose";

interface UserAttrs {
  id: string;
  cognitoId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;

  findByEvent(event: { id: string; version: number }): Promise<UserDoc | null>;
}

export interface UserDoc extends mongoose.Document {
  cognitoId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  version: number;
}

const userSchema = new mongoose.Schema(
  {
    cognitoId: {
      type: String,
      required: true,
    },
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
    },
    mobileNumber: {
      type: String,
      required: true,
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
userSchema.set("versionKey", "version");
userSchema.pre("save", function (done) {
  // @ts-ignore
  this.$where = {
    version: this.get("version") - 1,
  };
  done();
});
userSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return User.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    _id: attrs.id,
    cognitoId: attrs.cognitoId,
    firstName: attrs.firstName,
    lastName: attrs.lastName,
    mobileNumber: attrs.mobileNumber,
    email: attrs.email,
  });
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
