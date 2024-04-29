import mongoose from "mongoose";
import { SubscriberDoc } from "./subscriber";
import { IGroupSubscriber } from "@interfaces/IGroupSubscribers";

export interface GroupSubscriberDoc extends mongoose.Document {
  _id: string;
  organization: string;
  group: string;
  subscriber: SubscriberDoc;
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
const GroupSubscriber = mongoose.model<
  GroupSubscriberDoc,
  GroupSubscriberModel
>("GroupSubscriber", groupSchema);

export { GroupSubscriber };
