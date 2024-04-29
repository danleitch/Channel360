import { Listener, Subjects, GroupDeletedEvent } from "@channel360/core";
import { Group } from "@models/group";
import { GroupSubscriber } from "@models/groupSubscriber";
import { queueSubscriberGroupName } from "./queueGroupName";
import { JsMsg, NatsConnection } from "nats";

export class GroupDeletedListener extends Listener<GroupDeletedEvent> {
  readonly subject: Subjects.GroupDeleted = Subjects.GroupDeleted;

  stream = "GROUP";

  durableName = "campaign-subscriber-group-deleted-consumer";

  queueGroupName = queueSubscriberGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: GroupDeletedEvent["data"], msg: JsMsg) {
    // Delete all GroupSubscribers.

    const groupSubscribers = await GroupSubscriber.find({ group: data.id });

    if (groupSubscribers) {
      for (const groupSubscriber of groupSubscribers) {
        await groupSubscriber.deleteOne();
      }
    }

    // Delete Group

    await Group.findOneAndDelete({ _id: data.id });

    msg.ack();
  }
}
