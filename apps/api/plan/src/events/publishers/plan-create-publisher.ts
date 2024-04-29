import { Publisher, PlanCreatedEvent, Subjects } from "@channel360/core";

export class PlanCreatedPublisher extends Publisher<PlanCreatedEvent> {
  subject: Subjects.PlanCreated = Subjects.PlanCreated;
}
