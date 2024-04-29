import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";
import {OrganizationDoc} from "src/models/organization";

interface SettingsAttrs {
    id: string;
    optOutMessage: string;
    optInMessage: string;
}

export interface SettingsDoc extends mongoose.Document {
    optOutMessage: string;
    optInMessage: string;
    version: number;
}

interface SettingsModel extends mongoose.Model<SettingsDoc> {
    build(attrs: SettingsAttrs): SettingsDoc;
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<SettingsDoc | null>;
}

const settingsSchema = new mongoose.Schema(
    {
        optOutMessage: {
            type: String,
        },
        optInMessage: {
            type: String,
        }
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
settingsSchema.set("versionKey", "version");
settingsSchema.plugin(updateIfCurrentPlugin);

settingsSchema.statics.build = (attrs: SettingsAttrs) => {
    return new Settings({
        ...attrs,
        _id: attrs.id,
    });
};

settingsSchema.statics.findByEvent = (event: {
    id: string;
    version: number;
}) => {
    return Settings.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

const Settings = mongoose.model<SettingsDoc, SettingsModel>(
    "Settings",
    settingsSchema
);

export {Settings};
