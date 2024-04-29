import { Listener, TemplateCreatedEvent, Subjects } from '@channel360/core'
import { Templates } from '@models/templates'
import { JsMsg, NatsConnection } from 'nats'

export class TemplateCreatedListener extends Listener<TemplateCreatedEvent> {
	readonly subject: Subjects.TemplateCreated = Subjects.TemplateCreated

	stream = 'SMOOCH_TEMPLATES'

	durableName = 'template-smoochapp-template-created-consumer'

	constructor(natsClient: NatsConnection) {
		super(natsClient)
	}

	async onMessage(data: TemplateCreatedEvent['data'], msg: JsMsg) {
		const templates = Templates.build({
			organization: data.organization,
			name: data.name,
			description: data.description,
			namespace: data.namespace,
			enabled: data.enabled,
			status: data.status,
			language: data.language,
			category: data.category,
			components: data.components,
			tags: data.tags,
			messageTemplateId: data.messageTemplateId,
		})

		await templates.save()

		msg.ack()
	}
}
