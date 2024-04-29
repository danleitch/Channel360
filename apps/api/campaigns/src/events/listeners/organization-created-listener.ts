import { Listener, OrganizationCreatedEvent, Subjects } from "@channel360/core";
import { Organization } from "@models/organization";
import { queueOrganizationGroupName } from "./queueGroupName";
import { JsMsg, NatsConnection } from "nats";

export class OrganizationCreatedListener extends Listener<OrganizationCreatedEvent> {
  readonly subject: Subjects.OrganizationCreated = Subjects.OrganizationCreated;

  stream = "ORGANIZATION";

  durableName = "campaign-organization-created-consumer";

  queueGroupName = queueOrganizationGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: OrganizationCreatedEvent["data"], msg: JsMsg) {
    // check if the organization exists.
    const organizationExists = await Organization.findById(data.id);
    // if it does then msg.ack();
    if (organizationExists) {
      return msg.ack();
    }
    const organization = Organization.build({
      id: data.id,
      users: data.users || [],
      name: data.name,
      settings: data.settings!,
    });
    await organization.save();

    msg.ack();
  }
}
