import { Publisher, AppUserCreatedEvent, Subjects } from "@channel360/core";

export class AppUserCreatedPublisher extends Publisher<AppUserCreatedEvent> {
    subject: Subjects.AppUserCreated = Subjects.AppUserCreated;
}
