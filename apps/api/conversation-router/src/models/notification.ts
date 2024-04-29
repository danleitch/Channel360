import mongoose from "mongoose";

interface NotificationAttrs {
  id: string;
  conversationId?: string;
  notification_id?: string;
  reference?: string;
  category: string;
  mobileNumber?: string;
  organization: string;
  campaign?: string;
  status?: string;
  scheduled?: Date;
}

export interface NotificationDoc extends mongoose.Document {
  notification_id?: string;
  category: string;
  mobileNumber?: string;
  conversationId?: string;
  reference?: string;
  organization: string;
  campaign?: string;
  status?: string;
  createdAt: Date;
  scheduled: Date;
}

interface NotificationModel extends mongoose.Model<NotificationDoc> {
  build(attrs: NotificationAttrs): NotificationDoc;
}

const notificationSchema = new mongoose.Schema(
  {
    notification_id: {
      type: String,
    },
    category: {
      type: String,
      enum: ["MARKETING", "AUTHENTICATION", "UTILITY"],
      required: true,
    },
    mobileNumber: {
      type: String,
      required: false,
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
    failure_reason: {
      type: String,
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

notificationSchema.statics.build = (attrs: NotificationAttrs) => {
  return new Notification({ ...attrs, _id: attrs.id });
};
notificationSchema.index({ organization: 1 });
notificationSchema.index({ organization: 1, campaign: 1 });
notificationSchema.index({ organization: 1, status: 1 });
notificationSchema.index({ campaign: 1, status: 1 });
const Notification = mongoose.model<NotificationDoc, NotificationModel>(
  "Notification",
  notificationSchema,
);

export { Notification };
