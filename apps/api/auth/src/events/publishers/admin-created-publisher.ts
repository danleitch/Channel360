import {Publisher, AdminCreatedEvent, Subjects, AdminUpdatedEvent} from "@channel360/core";

export class AdminCreatedPublisher extends Publisher<AdminCreatedEvent> {
  subject: Subjects.AdminCreated = Subjects.AdminCreated;
}

export class AdminUpdatedPublisher extends Publisher<AdminUpdatedEvent> {
  subject: Subjects.AdminUpdated = Subjects.AdminUpdated;
}
