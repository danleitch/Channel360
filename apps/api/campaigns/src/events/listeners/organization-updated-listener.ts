import {
  BadRequestError,
  Listener,
  OrganizationUpdatedEvent,
  Subjects,
} from "@channel360/core";
import { Organization } from "@models/organization";
import { queueOrganizationGroupName } from "./queueGroupName";
import { JsMsg, NatsConnection } from "nats";

export class OrganizationUpdatedListener extends Listener<OrganizationUpdatedEvent> {
  readonly subject: Subjects.OrganizationUpdated = Subjects.OrganizationUpdated;

  stream = "ORGANIZATION";

  durableName = "campaign-organization-updated-consumer";

  queueGroupName = queueOrganizationGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: OrganizationUpdatedEvent["data"], msg: JsMsg) {
    const { users, name, settings } = data;

    const organization = await Organization.findByEvent(data);

    if (!organization) {
      // Find Organization by ID, if the version of data is less than current version, then msg.ack();
      const checkOrganization = await Organization.findById(data.id);
      if (checkOrganization) {
        if (checkOrganization.version >= data.version) {
          return msg.ack();
        }
      }
      return new BadRequestError("Organization not found");
    }

    organization.set({ name, users, settings });
    await organization.save();

    msg.ack();
  }
}
