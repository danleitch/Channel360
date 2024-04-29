import { Publisher, TemplateImportedEvent, Subjects } from '@channel360/core'

export class TemplateImportedPublisher extends Publisher<TemplateImportedEvent> {
	subject: Subjects.TemplateImported = Subjects.TemplateImported
}
