import mongoose from "mongoose";

interface VerificationAttrs {
    user: string;
    verificationMethod: string;
    verifiedAt: Date;
}

interface VerificationModel extends mongoose.Model<VerificationDoc> {
    build(attrs: VerificationAttrs): VerificationDoc;
    findByEvent(event: { id: string; version: number }): Promise<VerificationDoc | null>;
}

export interface VerificationDoc extends mongoose.Document {
    user: string;
    otp: string;
    createdAt: Date;
}

const verificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        verificationMethod: {
            type: String,
            required: true,
        },
        verifiedAt: {
            type: Date,
            default: Date.now,
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

verificationSchema.statics.build = (attrs: VerificationAttrs) => {
    return new Verification(attrs);
};
verificationSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Verification.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

verificationSchema.statics.build = (attrs: VerificationAttrs) => {
    return new Verification(attrs);
};

const Verification = mongoose.model<VerificationDoc, VerificationModel>("Verification", verificationSchema);

export { Verification };
