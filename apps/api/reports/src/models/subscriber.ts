import mongoose from "mongoose";

interface SubscriberDoc extends mongoose.Document {
  organization: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  optInStatus: boolean;
}

const subscriberSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    optInStatus: {
      type: Boolean,
      required: true,
      default: true,
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

export { subscriberSchema, SubscriberDoc };
