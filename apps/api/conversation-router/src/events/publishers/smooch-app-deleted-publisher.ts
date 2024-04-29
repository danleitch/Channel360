import { Publisher, SmoochAppDeletedEvent, Subjects } from "@channel360/core";

export class SmoochAppDeletedPublisher extends Publisher<SmoochAppDeletedEvent> {
  subject: Subjects.SmoochAppDeleted = Subjects.SmoochAppDeleted;
}
