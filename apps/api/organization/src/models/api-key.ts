import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { IAPIKey } from "@interfaces/IAPIKey";


export interface APIKeyDoc extends mongoose.Document {
  organization: string;
  apiKey: string;
  revoked?: boolean;
  version: number;
}

interface APIKeyModel extends mongoose.Model<APIKeyDoc> {
  build(attrs: IAPIKey): APIKeyDoc;
}

const apiKeySchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
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


apiKeySchema.index({ organization: 1, apiKey: 1 }, { unique:true, expireAfterSeconds: 0 });

apiKeySchema.statics.build = (attrs: IAPIKey) => {
  return new APIKey(attrs);
};

const APIKey = mongoose.model<APIKeyDoc, APIKeyModel>('ApiKey', apiKeySchema);

export { APIKey };
