import { Publisher, TemplateIngestedEvent, Subjects } from "@channel360/core";

export class TemplateIngestedPublisher extends Publisher<TemplateIngestedEvent> {
  subject: Subjects.TemplateIngested = Subjects.TemplateIngested;
}
