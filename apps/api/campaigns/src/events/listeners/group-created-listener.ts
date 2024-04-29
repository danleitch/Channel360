import { Listener, GroupCreatedEvent, Subjects } from "@channel360/core";
import { Organization } from "@models/organization";
import { Group } from "@models/group";
import { queueSubscriberGroupName } from "./queueGroupName";
import { JsMsg, NatsConnection } from "nats";

export class GroupCreatedListener extends Listener<GroupCreatedEvent> {
  readonly subject: Subjects.GroupCreated = Subjects.GroupCreated;

  stream = "GROUP";

  durableName = "campaign-subscriber-group-created-consumer";

  queueGroupName = queueSubscriberGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: GroupCreatedEvent["data"], msg: JsMsg) {
    const { id, description, name, organization } = data;

    const org = await Organization.findById(organization);

    if (!org) {
      return console.error("Organization not found");
    }

    const groupExists = await Group.findById(id);

    if (groupExists) {
      return msg.ack();
    }

    const group = Group.build({
      _id: id,
      organization: org.id,
      name,
      description,
    });

    await group.save();
    msg.ack();
  }
}
