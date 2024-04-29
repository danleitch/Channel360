import { Publisher, TemplateDeletedEvent, Subjects } from '@channel360/core'

export class TemplateDeletedPublisher extends Publisher<TemplateDeletedEvent> {
	subject: Subjects.TemplateDeleted = Subjects.TemplateDeleted
}
