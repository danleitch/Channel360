import { Listener, SmoochAppCreatedEvent, Subjects } from '@channel360/core'
import { SmoochApp } from '@models/smoochApp'
import { NatsConnection } from "nats";

export class SmoochAppCreatedListener extends Listener<SmoochAppCreatedEvent> {
	readonly subject: Subjects.SmoochAppCreated = Subjects.SmoochAppCreated

	durableName = 'template-smooch-app-created-consumer'

	stream = 'SMOOCH_APP'

	constructor(natsClient: NatsConnection) {
		super(natsClient)
	}

	async onMessage(data: SmoochAppCreatedEvent['data'], msg: any) {
		const smoochApp = SmoochApp.build(data)
		await smoochApp.save()

		msg.ack()
	}
}
