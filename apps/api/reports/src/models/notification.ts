import mongoose from "mongoose";

interface NotificationDoc extends mongoose.Document {
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

  scheduled: Date;
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
  },
);

notificationSchema.index({
  organization: 1,
  created_at: 1,
});

notificationSchema.index({ campaign: 1 });

export { notificationSchema, NotificationDoc };
