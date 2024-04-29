import { Listener, SmoochAppDeletedEvent, Subjects } from '@channel360/core'
import { SmoochApp } from '@models/smoochApp'
import { NatsConnection } from "nats";

export class SmoochAppDeletedListener extends Listener<SmoochAppDeletedEvent> {
	readonly subject: Subjects.SmoochAppDeleted = Subjects.SmoochAppDeleted

	durableName = 'template-smooch-app-deleted-consumer'

	stream = 'SMOOCH_APP'

	constructor(natsClient: NatsConnection) {
		super(natsClient)
	}

	async onMessage(data: SmoochAppDeletedEvent['data'], msg: any) {
		await SmoochApp.findOneAndDelete({
			appId: data.appId,
		})

		msg.ack()
	}
}
