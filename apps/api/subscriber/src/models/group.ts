import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { IGroup } from "@interfaces/IGroup";

export interface GroupDoc extends mongoose.Document {
  organization: string;
  name: string;
  description: string;
  createdBy: string;
  enabled: boolean;
  memberCount?: number;
  version: number;
}

interface GroupModel extends mongoose.Model<GroupDoc> {
  build(attrs: IGroup): GroupDoc;
}

const groupSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    createdBy: {
      type: String,
      required: false,
    },
    enabled: {
      type: Boolean,
      required: false,
      default: false,
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
  }
);
groupSchema.set("versionKey", "version");
groupSchema.plugin(updateIfCurrentPlugin);
groupSchema.index({ organization: 1 });

groupSchema.statics.build = (attrs: IGroup) => {
  return new Group(attrs);
};

groupSchema.virtual("memberCount", {
  ref: "GroupSubscriber",
  localField: "_id",
  foreignField: "group",
  count: true,
});

const Group = mongoose.model<GroupDoc, GroupModel>("Group", groupSchema);

export { Group };
