import { Listener, OrganizationUpdatedEvent, Subjects } from '@channel360/core'
import { Organization } from '@models/organization'
import { JsMsg, NatsConnection } from 'nats'
import { organizationQueueGroupName } from './queueGroupName'

export class OrganizationUpdatedListener extends Listener<OrganizationUpdatedEvent> {
	readonly subject: Subjects.OrganizationUpdated = Subjects.OrganizationUpdated

	stream = 'ORGANIZATION'

	durableName = 'template-organization-updated-consumer'

	queueGroupName = organizationQueueGroupName

	constructor(natsClient: NatsConnection) {
		super(natsClient)
	}

	async onMessage(data: OrganizationUpdatedEvent['data'], msg: JsMsg) {
		const { users, name } = data

		const organization = await Organization.findByEvent(data)

		if (!organization) {
			const checkOrganization = await Organization.findById(data.id)
			if (checkOrganization) {
				if (checkOrganization.version >= data.version) {
					return msg.ack()
				}
			}
			return new Error('Organization not found')
		}

		organization.set({ name, users })
		await organization.save()

		msg.ack()
	}
}
