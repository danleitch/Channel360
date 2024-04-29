import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";
import {OrganizationDoc} from "./organization";

interface CustomerAttrs {
    firstName?: string;
    mobileNumber: string;
    lastName?: string;
    fullName?: string;
    emailAddress?: string;

    authorId: string;

    organization: string;
}

interface CustomerDoc extends mongoose.Document {
    firstName?: string;
    authorId: string;
    mobileNumber: string;
    lastName?: string;
    fullName?: string;
    emailAddress?: string;

    organization: string;
}

interface CustomerModel extends mongoose.Model<CustomerDoc> {
    build(attrs: CustomerAttrs): CustomerDoc;
}

const customerSchema = new mongoose.Schema(
    {
        firstName: {type: String, isRequired: false},
        authorId: {type: String, isRequired: true},
        mobileNumber: {type: String, isRequired: true},
        lastName: {type: String, isRequired: false},
        fullName: {type: String, isRequired: false},
        emailAddress: {type: String, isRequired: false},
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
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
customerSchema.set("versionKey", "version");
customerSchema.plugin(updateIfCurrentPlugin);
customerSchema.index({organization: 1})

customerSchema.statics.build = (attrs: CustomerAttrs) => {
    return new Customer(attrs);
};

const Customer = mongoose.model<CustomerDoc, CustomerModel>(
    "Customer",
    customerSchema
);

export {Customer};
