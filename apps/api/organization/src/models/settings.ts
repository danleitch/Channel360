import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ISettings } from "@interfaces/ISettings";

export interface SettingsDoc extends mongoose.Document {
  optOutMessage: string;
  optInMessage: string;
  version: number;
}

interface SettingsModel extends mongoose.Model<SettingsDoc> {
  build(attrs: ISettings): SettingsDoc;
}

const settingsSchema = new mongoose.Schema(
  {
    optOutMessage: {
      type: String,
      default: "You have successfully opted out of our marketing list.",
    },
    optInMessage: {
      type: String,
      default: "You have successfully opted into our marketing list.",
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
settingsSchema.set("versionKey", "version");
settingsSchema.plugin(updateIfCurrentPlugin);
settingsSchema.statics.build = (attrs: ISettings) => {
  return new Settings(attrs);
};

const Settings = mongoose.model<SettingsDoc, SettingsModel>(
  "Settings",
  settingsSchema,
);

export { Settings };
