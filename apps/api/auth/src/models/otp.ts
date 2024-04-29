import mongoose from "mongoose";

interface OtpAttrs {
    user: string;
    otp: string;
    createdAt: Date;
}

interface OtpModel extends mongoose.Model<OtpDoc> {
    build(attrs: OtpAttrs): OtpDoc;
    findByEvent(event: { id: string; version: number }): Promise<OtpDoc | null>;
}

export interface OtpDoc extends mongoose.Document {
    user: string;
    otp: string;
    createdAt: Date;
}

const otpSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300,
        },
    },
    {
        toJSON: {
            transform(_, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

otpSchema.statics.build = (attrs: OtpAttrs) => {
    return new Otp(attrs);
};
otpSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Otp.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

otpSchema.statics.build = (attrs: OtpAttrs) => {
    return new Otp(attrs);
};

const Otp = mongoose.model<OtpDoc, OtpModel>("Otp", otpSchema);

export { Otp };
