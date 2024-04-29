import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TemplateAttrs {
  organization: string;
  name: string;
  category: string;
}

export interface TemplatesDoc extends mongoose.Document {
  organization: string;
  name: string;
  category: string;
}

interface TemplatesModel extends mongoose.Model<TemplatesDoc> {
  build(attrs: TemplateAttrs): TemplatesDoc;
}

const templatesSchema = new mongoose.Schema(
  {
    //Channel360 Fields
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    category: {
      type: String,
      enum: ["MARKETING", "AUTHENTICATION", "UTILITY"],
      required: true,
    },
    name: {
      type: String,
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
  },
);
templatesSchema.set("versionKey", "version");
templatesSchema.plugin(updateIfCurrentPlugin);

templatesSchema.statics.build = (attrs: TemplateAttrs) => {
  return new Templates(attrs);
};

const Templates = mongoose.model<TemplatesDoc, TemplatesModel>(
  "Templates",
  templatesSchema,
);

export { Templates };
