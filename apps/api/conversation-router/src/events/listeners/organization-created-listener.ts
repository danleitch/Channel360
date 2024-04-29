import { Listener, OrganizationCreatedEvent, Subjects } from "@channel360/core";
import { Organization } from "@models/organization";
import { JsMsg, NatsConnection } from "nats";
import { organizationQueueGroupName } from "./queuGroupName";

export class OrganizationCreatedListener extends Listener<OrganizationCreatedEvent> {
  readonly subject: Subjects.OrganizationCreated = Subjects.OrganizationCreated;

  stream = "ORGANIZATION";

  durableName = "organization-created-consumer";

  queueGroupName = organizationQueueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: OrganizationCreatedEvent["data"], msg: JsMsg) {
    const organization = Organization.build({
      id: data.id,
      users: data.users || [],
      name: data.name,
      settings: data.settings || undefined,
    });
    await organization.save().catch((err) => {
      console.log("Error Creating Organization", err);
      msg.ack();
    });

    msg.ack();
  }
}
