import { OrganizationUpdatedEvent, Publisher, Subjects } from "@channel360/core";

export class OrganizationUpdatedPublisher extends Publisher<OrganizationUpdatedEvent> {
  subject: Subjects.OrganizationUpdated = Subjects.OrganizationUpdated;
}
