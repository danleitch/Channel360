import { Listener, Subjects, OrganizationUpdatedEvent } from "@channel360/core";
import { Organization } from "@models/organization";
import { JsMsg, NatsConnection } from "nats";
import { organizationQueueGroupName } from "./queuGroupName";

export class OrganizationUpdatedListener extends Listener<OrganizationUpdatedEvent> {
  readonly subject: Subjects.OrganizationUpdated = Subjects.OrganizationUpdated;

  stream = "ORGANIZATION";

  durableName = "organization-updated-consumer";

  queueGroupName = organizationQueueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: OrganizationUpdatedEvent["data"], msg: JsMsg) {

    const organization = await Organization.findByEvent(data);

    if (!organization) {
      throw new Error("Organization not found");
    }

    organization.set(data);
    await organization.save().catch((err) => {
      console.log("There was an error updating organization", err);
      msg.ack();
    });

    msg.ack();
  }
}
