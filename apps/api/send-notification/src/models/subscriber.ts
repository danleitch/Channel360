import mongoose from "mongoose";
interface SusbcriberAttrs {
  _id: string;
  organization: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  optInStatus: boolean;
}

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
  build(attrs: SusbcriberAttrs): SubscriberDoc;
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
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    optInStatus: {
      type: Boolean,
      required: true,
      default: false,
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
subscriberSchema.pre("save", function (done) {
  // @ts-ignore
  this.$where = {
    version: this.get("version") - 1,
  };
  done();
});
subscriberSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Subscriber.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

subscriberSchema.statics.build = (attrs: SusbcriberAttrs) => {
  return new Subscriber(attrs);
};

const Subscriber = mongoose.model<SubscriberDoc, SubscriberModel>(
  "Subscriber",
  subscriberSchema
);

export { Subscriber };
