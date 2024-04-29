import { Publisher, GroupDeletedEvent, Subjects } from "@channel360/core";

export class GroupDeletedPublisher extends Publisher<GroupDeletedEvent> {
  subject: Subjects.GroupDeleted = Subjects.GroupDeleted;
}
