import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { IResponse } from "@interfaces/IResponse";

export interface ResponseDoc extends mongoose.Document {
  organization: string;
  campaign: string;
  recipient: string;
  text: string;
}

interface ResponseModel extends mongoose.Model<ResponseDoc> {
  build(attrs: IResponse): ResponseDoc;
}

const responseSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaigns",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipient",
      required: true,
    },
    text: {
      type: String,
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
  }
);
responseSchema.set("versionKey", "version");
responseSchema.plugin(updateIfCurrentPlugin);
responseSchema.index({ organization: 1, campaign: 1 });
responseSchema.index({
  campaign: 1,
  organization: 1,
  recipient: 1,
});

responseSchema.statics.build = (attrs: IResponse) => {
  return new Response(attrs);
};

const Response = mongoose.model<ResponseDoc, ResponseModel>(
  "Response",
  responseSchema
);

export { Response };
