import { Publisher, SettingsUpdatedEvent, Subjects } from "@channel360/core";

export class SettingsUpdatedPublisher extends Publisher<SettingsUpdatedEvent> {
  subject: Subjects.SettingsUpdated = Subjects.SettingsUpdated;
}
