import { Publisher, GroupUpdatedEvent, Subjects } from "@channel360/core";

export class GroupUpdatedPublisher extends Publisher<GroupUpdatedEvent> {
  subject: Subjects.GroupUpdated = Subjects.GroupUpdated;
}
