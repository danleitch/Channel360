import { Tag } from "@channel360/core";
import mongoose from "mongoose";
import { ICampaign } from "@interfaces/ICampaign";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface CampaignsDoc extends mongoose.Document {
  organization: string;
  reference: string;
  template: string;
  status: string;
  creator?: string;
  scheduled: Date;
  started?: Date;
  completed?: Date;
  subscriberGroup: string;
  tags?: Tag;

  color?: string;
  version: number;
}

interface CampaignsModel extends mongoose.Model<CampaignsDoc> {
  build(attrs: ICampaign): CampaignsDoc;
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
      buttons: [
        {
          type: { type: String },
          value: String,
          prompt: String,
          fields: String,
          url:String
        }
      ]
    },
    color: {
      type: String,
      default: "#fff",
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
campaignsSchema.set("versionKey", "version");
campaignsSchema.plugin(updateIfCurrentPlugin);
campaignsSchema.index({ reference: 1, organization: 1 }, { unique: true });

campaignsSchema.statics.build = (attrs: ICampaign) => {
  return new Campaigns(attrs);
};

const Campaigns = mongoose.model<CampaignsDoc, CampaignsModel>(
  "Campaigns",
  campaignsSchema
);

export { Campaigns };
