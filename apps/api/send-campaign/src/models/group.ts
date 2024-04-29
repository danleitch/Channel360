import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface GroupAttrs {
  _id: string;
  organization: string;
  name: string;
  description: string;
}

export interface GroupDoc extends mongoose.Document {
  _id: string;
  organization: string;
  name: string;
  description: string;
  createdBy: string;
  enabled: boolean;
  memberCount: number;
  version: number;
}

interface GroupModel extends mongoose.Model<GroupDoc> {
  build(attrs: GroupAttrs): GroupDoc;
  findByEvent(event: { id: string; version: number }): Promise<GroupDoc | null>;
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
    memberCount: {
      type: Number,
      required: false,
      default: 0,
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
groupSchema.set("versionKey", "version");
groupSchema.index({organization: 1});
groupSchema.plugin(updateIfCurrentPlugin);
groupSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Group.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

groupSchema.statics.build = (attrs: GroupAttrs) => {
  return new Group(attrs);
};

const Group = mongoose.model<GroupDoc, GroupModel>("Group", groupSchema);

export { Group };
