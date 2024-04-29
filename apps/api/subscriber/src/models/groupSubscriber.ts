import mongoose from "mongoose";
import { IGroupSubscriber } from "@interfaces/IGroupSubscriber";

export interface GroupSubscriberDoc extends mongoose.Document {
  organization: string;
  group: string;
  subscriber: string;
}

interface GroupSubscriberModel extends mongoose.Model<GroupSubscriberDoc> {
  build(attrs: IGroupSubscriber): GroupSubscriberDoc;
}

const groupSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
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
  }
);

groupSchema.statics.build = (attrs: IGroupSubscriber) => {
  return new GroupSubscriber(attrs);
};

groupSchema.index({ organization: 1 });
groupSchema.index(
  { organization: 1, group: 1, subscriber: 1 },
  { unique: true }
);
const GroupSubscriber = mongoose.model<
  GroupSubscriberDoc,
  GroupSubscriberModel
>("GroupSubscriber", groupSchema);

export { GroupSubscriber };
