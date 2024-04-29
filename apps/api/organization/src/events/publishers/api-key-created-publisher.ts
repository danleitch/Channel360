import { APIKeyCreatedEvent, Publisher, Subjects } from "@channel360/core";

export class APIKeyCreatedPublisher extends Publisher<APIKeyCreatedEvent> {
  subject: Subjects.APIKeyCreated = Subjects.APIKeyCreated;
}