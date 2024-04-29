import mongoose from "mongoose";

interface CustomerDoc extends mongoose.Document {
  firstName?: string;
  authorId: string;
  mobileNumber: string;
  lastName?: string;
  fullName?: string;
  emailAddress?: string;

  organization: string;
}

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String, isRequired: false },
    authorId: { type: String, isRequired: true },
    mobileNumber: { type: String, isRequired: true },
    lastName: { type: String, isRequired: false },
    fullName: { type: String, isRequired: false },
    emailAddress: { type: String, isRequired: false },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
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

// const Customer = loggingConnection.model<CustomerDoc>("Customer", customerSchema);
//
// export { Customer };
