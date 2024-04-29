import { OrganizationCreatedEvent, Publisher, Subjects } from "@channel360/core";

export class OrganizationCreatedPublisher extends Publisher<OrganizationCreatedEvent> {
  subject: Subjects.OrganizationCreated = Subjects.OrganizationCreated;
}
