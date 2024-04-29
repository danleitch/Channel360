import {
  Publisher,
  Subjects, NotificationStatusEvent,
} from "@channel360/core";

export class NotificationStatusPublisher extends  Publisher<NotificationStatusEvent> {
  subject: Subjects.NotificationStatusCreated = Subjects.NotificationStatusCreated;
}
