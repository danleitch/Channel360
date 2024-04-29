import { TemplateCreatedEvent } from '@channel360/core'
import { natsWrapper } from '../../../nats-wrapper'
import { TemplateCreatedListener } from '@listeners/template-created-listener'
import { Templates } from '@models/templates'
import { JsMsg } from 'nats'
import { Organization } from '@models/organization'
import mongoose from 'mongoose'

describe('TemplateCreatedListener 📜', () => {
	const setup = async () => {
		// build a mock organization in the database
		const organization = Organization.build({
			id: new mongoose.Types.ObjectId().toHexString(), // Use mongoose.Types.ObjectId here
			name: 'Test Organization',
			users: [],
			settings: 'some settings',
		})
		await organization.save()

		const data: TemplateCreatedEvent['data'] = {
			tags: {
				head: [
					{
						type: 'hard-coded',
						value: 'TAG',
					},
				],
				body: [
					{
						index: 1,
						type: 'hard-coded',
						value: 'TAG',
					},
					{
						index: 2,
						type: 'hard-coded',
						value: 'TAG',
					},
				],
			},
			//use id in the SmoochAppTemplateCreatedEvent data
			organization: organization.id,
			name: 'TestTemplate',
			description: 'Test Description for a test template',
			namespace: 'TestNamespace',
			language: 'en-US',
			category: 'MARKETING',
			enabled: true,
			status: 'APPROVED',
			components: [
				{
					type: 'HEADER',
					format: 'TEXT',
					text: 'QA TESTING ALERT!! {{1}}',
				},
				{
					type: 'BODY',
					text: 'This is a test {{1}} {{2}} template with no merge tags and CTA Button to our Staging Environment. ',
				},
				{
					type: 'FOOTER',
					text: '(C) Channel Mobile Team. Stop to optout. ',
				},
			],
		}

		// @ts-expect-error: mock for JsMsg interface
		const msg: JsMsg = {
			ack: jest.fn(),
		}

		const listener = new TemplateCreatedListener(natsWrapper.client)

		return { listener, data, msg }
	}

	it('should handle TemplateCreatedEvent and save templates', async () => {
		const { listener, data, msg } = await setup()

		await listener.onMessage(data, msg)

		const createdTemplate = await Templates.findOne({ name: data.name })

		expect(createdTemplate).toBeDefined()
		expect(createdTemplate!.description).toEqual(data.description)

		expect(msg.ack).toHaveBeenCalled()
	})
})
