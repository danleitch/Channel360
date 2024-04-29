import { Publisher, SmoochAppCreatedEvent, Subjects } from "@channel360/core";

export class SmoochAppCreatedPublisher extends Publisher<SmoochAppCreatedEvent> {
  subject: Subjects.SmoochAppCreated = Subjects.SmoochAppCreated;
}
