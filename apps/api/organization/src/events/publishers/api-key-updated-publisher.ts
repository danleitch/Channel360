import { APIKeyUpdatedEvent, Publisher, Subjects } from "@channel360/core";

export class APIKeyUpdatedPublisher extends Publisher<APIKeyUpdatedEvent> {
  subject: Subjects.APIKeyUpdated = Subjects.APIKeyUpdated;
}
