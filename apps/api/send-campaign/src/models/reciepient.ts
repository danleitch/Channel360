import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

export interface RecipientAttrs {
    organization: string;
    campaign: string;
    subscriber: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    status?: string;
    optInStatus: boolean;
    notificationId?: string;
}

export interface RecipientDoc extends mongoose.Document {
    organization: string;
    campaign: string;
    subscriber: string;

    mobileNumber: string;
    firstName: string;
    lastName: string;
    optInStatus: boolean;
    status?: string;
    notificationId?: string;
}

interface RecipientModel extends mongoose.Model<RecipientDoc> {
    build(attrs: RecipientAttrs): RecipientDoc;
}

const recipientSchema = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
        },
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaigns",
        },
        subscriber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscriber",
            required: true,
        },
        notificationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification",
        },
        mobileNumber: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        optInStatus: {
            type: Boolean,
            required: true,
            default: true,
        },
        status: {
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
recipientSchema.set("versionKey", "version");
recipientSchema.plugin(updateIfCurrentPlugin);
recipientSchema.index({organization: 1, campaign: 1})
recipientSchema.index({
    campaign: 1,
    organization: 1,
    mobileNumber: 1
})

recipientSchema.statics.build = (attrs: RecipientAttrs) => {
    return new Recipient(attrs);
};

const Recipient = mongoose.model<RecipientDoc, RecipientModel>(
    "Recipient",
    recipientSchema
);

export {Recipient};
