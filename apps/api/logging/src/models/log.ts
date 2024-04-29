import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

interface LogAttrs {
    conversationId: string;
    mobileNumber?: string;
    messageText: string;
    direction: string;
    status: string;

    organization: string;
}

export interface LogDoc extends mongoose.Document {
    conversationId: string;
    mobileNumber?: string;
    messageText: string;
    direction: string;
    status: string;
    organization: string;
}

interface LogModel extends mongoose.Model<LogDoc> {
    build(attrs: LogAttrs): LogDoc;
}

const logSchema = new mongoose.Schema(
    {
        conversationId: String,
        mobileNumber: String,
        messageText: String,
        direction: String,
        status: String,
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
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
logSchema.set("versionKey", "version");
logSchema.plugin(updateIfCurrentPlugin);
logSchema.index({organization: 1})

logSchema.statics.build = (attrs: LogAttrs) => {
    return new Log(attrs);
};

const Log = mongoose.model<LogDoc, LogModel>(
    "Log",
    logSchema
);

export {Log};
