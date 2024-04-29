import { Publisher, UserUpdatedEvent, Subjects } from "@channel360/core";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
