import mongoose from "mongoose";
import { INotification } from "@interfaces/INotification";

export interface NotificationDoc extends mongoose.Document {
  category: string;
  organization: string;
  reference?: string;
  notification_id?: string;
  subscriber?: string;
  mobileNumber?: string;
  firstName?: string;
  lastName?: string;
  optInStatus?: boolean;
  conversationId?: string;
  createdAt: Date;
  campaign?: string;
  status?: string;
  scheduled: Date;
}

interface NotificationModel extends mongoose.Model<NotificationDoc> {
  build(attrs: INotification): NotificationDoc;
}

const notificationSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "MARKETING",
      required: true,
    },
    notification_id: {
      type: String,
    },
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },
    mobileNumber: {
      type: String,
      required: false,
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
      required: false,
      default: true,
    },
    conversationId: {
      type: String,
    },
    reference: {
      type: String,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaigns",
    },
    status: {
      type: String,
    },
    scheduled: {
      type: Date,
      default: Date.now,
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

notificationSchema.statics.build = (attrs: INotification) => {
  return new Notification(attrs);
};
notificationSchema.index({ organization: 1, category: 1, status: 1 });
notificationSchema.index({ organization: 1, campaign: 1 });
notificationSchema.index({ organization: 1, status: 1 });
notificationSchema.index({ organization: 1, scheduled: 1 });
notificationSchema.index({ organization: 1, conversationId: 1 });
notificationSchema.index({
  campaign: 1,
  organization: 1,
  mobileNumber: 1,
  reference: 1,
  status: 1,
});
notificationSchema.index({
  campaign: 1,
  organization: 1,
  mobileNumber: 1,
});
notificationSchema.index({
  organization: 1,
  notification_id: 1,
});

const Notification = mongoose.model<NotificationDoc, NotificationModel>(
  "Notification",
  notificationSchema
);

export { Notification };
