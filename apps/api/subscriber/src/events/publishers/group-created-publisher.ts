import { Publisher, GroupCreatedEvent, Subjects } from "@channel360/core";

export class GroupCreatedPublisher extends Publisher<GroupCreatedEvent> {
  subject: Subjects.GroupCreated = Subjects.GroupCreated;
}
