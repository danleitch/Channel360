import {
	Publisher,
	TemplateInternalUpdatedEvent,
	Subjects,
} from '@channel360/core'

export class TemplateInternalUpdatedPublisher extends Publisher<TemplateInternalUpdatedEvent> {
	subject: Subjects.TemplateInternalUpdated = Subjects.TemplateInternalUpdated
}
