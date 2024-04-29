import mongoose from "mongoose";

interface NotificationAttrs {
  failure_reason?: string;
  conversationId?: string;
  notification_id?: string;
  reference?: string;
  firstName?: string;
  lastName?: string;
  optInStatus?: boolean;
  mobileNumber?: string;
  subscriber?: string;
  organization: string;
  campaign?: string;
  status?: string;

  scheduled?: Date;
}

export interface NotificationDoc extends mongoose.Document {
  notification_id?: string;
  failure_reason?: string;
  subscriber?: string;
  mobileNumber?: string;
  firstName?: string;
  lastName?: string;
  optInStatus?: boolean;
  conversationId?: string;
  reference?: string;
  organization: string;
  campaign?: string;
  status?: string;

  scheduled?: Date;
}

interface NotificationModel extends mongoose.Model<NotificationDoc> {
  build(attrs: NotificationAttrs): NotificationDoc;
}

const notificationSchema = new mongoose.Schema(
  {
    notification_id: {
      type: String,
    },
    failure_reason: {
      type: String,
    },
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
    },
    mobileNumber: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    optInStatus: {
      type: Boolean,
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
      default: new Date(),
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
  return new Notification(attrs);
};

const Notification = mongoose.model<NotificationDoc, NotificationModel>(
  "Notification",
  notificationSchema,
);

export { Notification };
