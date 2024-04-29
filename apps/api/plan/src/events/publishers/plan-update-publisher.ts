import { Publisher, PlanUpdatedEvent, Subjects } from "@channel360/core";

export class PlanUpdatedPublisher extends Publisher<PlanUpdatedEvent> {
  subject: Subjects.PlanUpdated = Subjects.PlanUpdated;
}
