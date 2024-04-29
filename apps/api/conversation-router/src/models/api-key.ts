import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface APIKeyAttr {
  id: string;
  organization: string;
  apiKey: string;
  revoked?: boolean;
}

interface APIKeyDoc extends mongoose.Document {
  organization: string;
  apiKey: string;
  revoked?: boolean;
  version: number;
}

interface APIKeyModel extends mongoose.Model<APIKeyDoc> {
  build(attrs: APIKeyAttr): APIKeyDoc;

  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<APIKeyDoc | null>;
}

const apiKeySchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    revoked: {
      type: Boolean,
      default: false,
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
apiKeySchema.set("versionKey", "version");
apiKeySchema.plugin(updateIfCurrentPlugin);

apiKeySchema.index({ expiresAt: 1 });

apiKeySchema.statics.build = (attrs: APIKeyAttr) => {
  return new APIKey({
    _id: attrs.id,
    organization: attrs.organization,
    apiKey: attrs.apiKey,
    revoked: attrs.revoked,
  });
};

apiKeySchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return APIKey.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const APIKey = mongoose.model<APIKeyDoc, APIKeyModel>("ApiKey", apiKeySchema);

export { APIKey };
