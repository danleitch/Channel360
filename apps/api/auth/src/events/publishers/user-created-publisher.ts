import { Publisher, UserCreatedEvent, Subjects } from "@channel360/core";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
