import mongoose from "mongoose";



export interface TemplatesDoc extends mongoose.Document {
  organization: string;
  name: string;
  description: string;
  namespace: string;
  status: string;
  language: string;
  category: string;
  enabled: boolean;
  messageTemplateId?: string;
}

const templatesSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    description: {
      type: String,
      required: true,
    },
    namespace: {
      type: String,
    },
    status: {
      type: String,
      default: "PENDING",
    },
    enabled: {
      type: Boolean,
      default: true,
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
    language: {
      type: String,
      required: true,
      default: "en",
    },

    messageTemplateId: { type: String },
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

// const Templates = templateConnection.model<TemplatesDoc>("Templates", templatesSchema);
//
// export { Templates };
