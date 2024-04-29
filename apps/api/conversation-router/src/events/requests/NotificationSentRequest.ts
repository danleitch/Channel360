import {
    NotificationSentEvent, Publisher,
    Subjects,
} from "@channel360/core";

export class NotificationSentRequest extends Publisher<NotificationSentEvent> {
    subject: Subjects.NotificationSent = Subjects.NotificationSent;
}
