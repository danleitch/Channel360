import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface WebhookAttrs {
  organization: string;
  target: string;
  triggers: string[];
}

export interface WebhookDoc extends mongoose.Document {
  organization: string;
  target: string;
  triggers: string[];
}

interface WebhookModel extends mongoose.Model<WebhookDoc> {
  build(attrs: WebhookAttrs): WebhookDoc;
}

const webhookSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    triggers: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
webhookSchema.set("versionKey", "version");
webhookSchema.plugin(updateIfCurrentPlugin);

webhookSchema.statics.build = (attrs: WebhookAttrs) => {
  return new Webhook(attrs);
};

const Webhook = mongoose.model<WebhookDoc, WebhookModel>(
  "Webhook",
  webhookSchema
);

export { Webhook };
