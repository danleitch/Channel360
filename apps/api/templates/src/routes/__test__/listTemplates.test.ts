import { app } from '@app'
import request from 'supertest'
import { Templates } from '@models/templates'

describe('listing and filtering templates', () => {
	it('should filter configured templates with dynamic buttons', async () => {
		// Create Organization with user
		const organization = await global.createOrganization()

		// Create a template with dynamic buttons (valid)
		const validTemplateWithDynamicButtons = Templates.build({
			tags: {
				head: [],
				body: [],
				buttons: [
					{
						type: 'on-campaign-creation',
						fields: 'firstName',
					},
				],
			},
			organization: organization!.id,
			description: 'This is an interactive template with dynamic buttons',
			namespace: '',
			status: 'APPROVED',
			enabled: true,
			category: 'MARKETING',
			name: 'valid_template_with_dynamic_buttons',
			language: 'en_US',
			components: [
				{
					type: 'HEADER',
					format: 'TEXT',
					text: "Hey"
				},
				{
					type: 'BODY',
					text: 'Hi This is a template demonstracting an interactive template',
					buttons: [],
				},
				{
					type: 'BUTTONS',
					buttons: [
						{
							type: 'URL',
							url: 'https://channel360.co.za/organization/{{1}}',
							text: 'View Dashboard',
						},
					],
				},
			],
		})

		// Create an invalid template with dynamic buttons
		const invalidTemplateWithDynamicButtons = Templates.build({
			tags: {
				head: [],
				body: [],
				buttons: [],
			},
			organization: organization.id,
			description:
				'This is an interactive template with dynamic buttons (invalid)',
			namespace: 'default',
			language: 'en_US',
			enabled: true,
			status: 'APPROVED',
			category: 'MARKETING',
			name: 'invalid_template_with_dynamic_buttons',
			components: [
				{
					type: 'HEADER',
					format: 'TEXT',
					text: 'Hi',
				},
				{
					type: 'BODY',
					text: 'This is a template demonstrating an interactive template',
				},
				{
					type: 'BUTTONS',
					buttons: [
						{
							type: 'URL',
							url: 'https://channel360.co.za/organization/{{1}}',
							text: 'View Dashboard',
						},
					],
				},
			],
		})

		await validTemplateWithDynamicButtons.save()
		await invalidTemplateWithDynamicButtons.save()

		// Make a request to fetch templates
		const response = await request(app)
			.get(`/webapi/org/${organization!.id}/templates/list?filter=configured`)
			.send()
			.expect(200)

		const templates = response.body

		// expect(templates.length).toEqual(1)
		expect(templates[0].name).toEqual('valid_template_with_dynamic_buttons')
	})
})
