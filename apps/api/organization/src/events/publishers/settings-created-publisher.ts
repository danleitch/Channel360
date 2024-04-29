import { Publisher, SettingsCreatedEvent, Subjects } from "@channel360/core";

export class SettingsCreatedPublisher extends Publisher<SettingsCreatedEvent> {
  subject: Subjects.SettingsCreated = Subjects.SettingsCreated;
}
