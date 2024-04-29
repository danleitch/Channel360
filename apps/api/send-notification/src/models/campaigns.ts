import { Tag } from "@channel360/core";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { SubscriberDoc } from "./subscriber";

export interface CampaignAttrs {
  organization: string;
  reference: string;
  template: string;
  status: string;
  creator: string;
  scheduled: Date;
  started?: Date;
  completed?: Date;
  subscriberGroup: string;
  tags?: Tag;
  recipients?: {
    subscriber: SubscriberDoc;
    created: Date;
    submitted: Date | null;
    completed: Date | null;
    status: string;
  }[];
}

export interface CampaignsDoc extends mongoose.Document {
  organization: string;
  reference: string;
  template: string;
  status: string;
  creator: string;
  scheduled: Date;
  started?: Date;
  completed?: Date;
  subscriberGroup: string;
  tags?: Tag;
  recipients: {
    subscriber: SubscriberDoc;
    created: Date;
    submitted: Date | null;
    completed: Date | null;
    status: string;
    notification: string;
  }[];

  version: number;
}

interface CampaignsModel extends mongoose.Model<CampaignsDoc> {
  build(attrs: CampaignAttrs): CampaignsDoc;
}

const campaignsSchema = new mongoose.Schema(
  {
    //Channel360 Fields
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    reference: {
      type: String,
      required: true,
    },

    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Templates",
    },
    status: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    scheduled: {
      type: Date,
      required: true,
    },
    started: {
      type: Date,
    },
    completed: {
      type: Date,
    },
    subscriberGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    tags: {
      head: [
        {
          _id: false,
          index: Number,
          type: { type: String },
          value: String,
          url: String,
          prompt: String,
          fields: String,
          document: {
            link: String,
            filename: String,
          },
        },
      ],
      body: [
        {
          _id: false,
          index: Number,
          type: { type: String },
          value: String,
          url: String,
          prompt: String,
          fields: String,
          document: {
            link: String,
            filename: String,
          },
        },
      ],
    },

    recipients: [
      {
        subscriber: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subscriber",
          required: true,
        },
        created: {
          type: Date,
        },
        submitted: {
          type: Date,
        },
        completed: {
          type: Date,
        },
        status: {
          type: String,
          required: true,
        },
        notification: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Notification",
        },
      },
    ],
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
campaignsSchema.set("versionKey", "version");
campaignsSchema.plugin(updateIfCurrentPlugin);
campaignsSchema.index({ reference: 1, organization: 1 });

campaignsSchema.statics.build = (attrs: CampaignAttrs) => {
  return new Campaigns(attrs);
};

const Campaigns = mongoose.model<CampaignsDoc, CampaignsModel>(
  "Campaigns",
  campaignsSchema,
);

export { Campaigns };
