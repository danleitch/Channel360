import { EmailEvent, Publisher, Subjects } from '@channel360/core'

export class EmailPublisher extends Publisher<EmailEvent> {
	subject: Subjects.EmailCreated = Subjects.EmailCreated
}
