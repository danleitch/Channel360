import { Listener, OrganizationCreatedEvent, Subjects } from '@channel360/core'
import { Organization } from '@models/organization'
import { organizationQueueGroupName } from './queueGroupName'
import { JsMsg, NatsConnection } from 'nats'

export class OrganizationCreatedListener extends Listener<OrganizationCreatedEvent> {
	readonly subject: Subjects.OrganizationCreated = Subjects.OrganizationCreated

	stream = 'ORGANIZATION'

	durableName = 'template-organization-created-consumer'

	queueGroupName = organizationQueueGroupName

	constructor(natsClient: NatsConnection) {
		super(natsClient)
	}

	async onMessage(data: OrganizationCreatedEvent['data'], msg: JsMsg) {
		const organization = Organization.build({
			id: data.id,
			users: data.users || [],
			name: data.name,
			settings: data.settings!,
		})
		await organization.save()

		msg.ack()
	}
}
