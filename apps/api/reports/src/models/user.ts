import mongoose from "mongoose";

interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  password: string;
  cognitoId?: string;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    cognitoId: {
      type: String,
      required: false,
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
  },
);

// const User = userConnection.model<UserDoc>("User", userSchema);
//
// export { User };
