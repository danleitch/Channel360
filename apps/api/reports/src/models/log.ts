import mongoose from "mongoose";
// import { loggingConnection } from "../connections";

export interface LogDoc extends mongoose.Document {
  conversationId: string;
  mobileNumber?: string;
  messageText: string;
  direction: string;
  status: string;
  organization: string;
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

// const Log = loggingConnection.model<LogDoc>("Log", logSchema);
//
// export { Log };
