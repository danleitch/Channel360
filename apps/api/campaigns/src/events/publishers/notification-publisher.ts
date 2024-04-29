import {
  Publisher,
  Subjects,
  NotificationCreatedEvent,
} from "@channel360/core";

export class NotificationCreatedPublisher extends Publisher<NotificationCreatedEvent> {
  subject: Subjects.NotificationCreated = Subjects.NotificationCreated;
}
