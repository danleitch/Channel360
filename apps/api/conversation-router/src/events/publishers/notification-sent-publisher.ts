import {NotificationSentEvent, Publisher, Subjects} from "@channel360/core";

export class NotificationSentPublisher extends Publisher<NotificationSentEvent> {
    subject: Subjects.NotificationSent = Subjects.NotificationSent;
}
