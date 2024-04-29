import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ISubscriber } from "@interfaces/ISubscriber";

export interface SubscriberDoc extends mongoose.Document {
  _id: string;
  organization: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  optInStatus: boolean;
  version: number;
}

interface SubscriberModel extends mongoose.Model<SubscriberDoc> {
  build(attrs: ISubscriber): SubscriberDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<SubscriberDoc | null>;
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
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
subscriberSchema.set("versionKey", "version");
subscriberSchema.plugin(updateIfCurrentPlugin);
subscriberSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Subscriber.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
subscriberSchema.index({ organization: 1 });

subscriberSchema.statics.build = (attrs: ISubscriber) => {
  return new Subscriber(attrs);
};

const Subscriber = mongoose.model<SubscriberDoc, SubscriberModel>(
  "Subscriber",
  subscriberSchema
);
export { Subscriber };
