import { Publisher, Subjects, TemplateSyncEvent } from "@channel360/core";

export class SyncTemplatesPublisher extends Publisher<TemplateSyncEvent> {
  subject: Subjects.TemplateSync = Subjects.TemplateSync;
}
