import {
  Publisher,
  Subjects,
  TemplateCreatedEvent,
} from "@channel360/core";

export class WhatsappTemplateCreatedPublisher extends Publisher<TemplateCreatedEvent> {
  subject: Subjects.TemplateCreated =
    Subjects.TemplateCreated;
}
