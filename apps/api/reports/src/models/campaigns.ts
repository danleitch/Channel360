import mongoose from "mongoose";

interface CampaignsDoc extends mongoose.Document {
  reference: string;
  scheduled: Date;
}

const campaignsSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
    },
    scheduled: {
      type: Date,
      required: true,
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

export { campaignsSchema, CampaignsDoc };
