import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

interface AppUserAttrs {
    destinationId: string;
    organization: string;
    appUser: string
}

export interface AppUserDoc extends mongoose.Document {
    destinationId: string;
    organization: string;
    appUser: string
}

interface AppUserModel extends mongoose.Model<AppUserDoc> {
    build(attrs: AppUserAttrs): AppUserDoc;
}

const appUserSchema = new mongoose.Schema(
    {
        destinationId: {
            type: String,
            required: true,
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true
        },
        appUser: {
            type: String,
            required: true
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);
appUserSchema.set("versionKey", "version");
appUserSchema.plugin(updateIfCurrentPlugin);
appUserSchema.index({organization: 1, appUser:1},{unique: true});


appUserSchema.statics.build = (attrs: AppUserAttrs) => {
    return new AppUser(attrs);
};

const AppUser = mongoose.model<AppUserDoc, AppUserModel>(
    "AppUser",
    appUserSchema
);

export {AppUser};
