import request from 'supertest'
import { app } from '../../app'
import { TemplateSyncSeeder } from '../../test/seeders/TemplateSyncSeeder'
import { Templates } from '@models/templates'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('sync-templates 📜', () => {
	it('should add a new template to the list', async () => {
		/**
		 * Create Organization.
		 */

		const organization = await global.createOrganization()

		/**
		 * Seed DB
		 */

		await new TemplateSyncSeeder().seed(organization.id)

		const response = await request(app)
			.post(`/api/ingest-templates/${organization.id}`)
			.send()

		// Wait for the background process to likely complete
		await sleep(3000); // 5 seconds

		/**
		 * Find Templates
		 */

		const templates = await Templates.find({ organization: organization.id })

		/**
		 * Assert that the template was added
		 */

		expect(response.status).toEqual(202)
		expect(templates.length).toEqual(4)
	})
	it('should update an existing template if there are changes', async () => {
		/**
		 * Create Organization.
		 */

		const organization = await global.createOrganization()

		/**
		 * Seed DB
		 */

		await new TemplateSyncSeeder().seed(organization.id)

		const response = await request(app)
			.post(`/api/ingest-templates/${organization.id}`)
			.send()

		// Wait for the background process to likely complete
		await sleep(3000); // 3 seconds

		/**
		 * Find Templates
		 */

		const templates = await Templates.find({ organization: organization.id })

		/**
		 * Assert that the template was added
		 */

		expect(response.status).toEqual(202)
		expect(templates.length).toEqual(4)
		expect(templates[1].name).toEqual('template_2')
		expect(templates[1].status).toEqual('APPROVED')
	})
	it('should not override existing template description and tags', async () => {
		/**
		 * Create Organization.
		 */

		const organization = await global.createOrganization()

		const template_4_insert = Templates.build({
			description: "template 4's description",
			namespace: '',
			organization: organization.id,
			messageTemplateId: '1093005095344555',
			name: 'template_4',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled: true,
			components: [
				{
					type: 'BODY',
					text: 'Hello World',
				},
			],
			tags: {
				head: [],
				body: [
					{
						index: 1,
						type: 'hard-coded',
						value: 'Hello World',
					},
				],
			},
		})

		await template_4_insert.save()

		/**
		 * Seed DB
		 */

		await new TemplateSyncSeeder().seed(organization.id)

		const response = await request(app)
			.post(`/api/ingest-templates/${organization.id}`)
			.send()

		// Wait for the background process to likely complete
		await sleep(3000); // 3 seconds

		/**
		 * Find Templates
		 */

		const templates = await Templates.find({ organization: organization.id })

		/**
		 * Assert that the template was added
		 */

		expect(response.status).toEqual(202)
		expect(templates.length).toEqual(4)
		expect(templates[0].name).toEqual('template_4')
		expect(templates[0].description).toEqual("template 4's description")
		expect(templates[0].tags.body[0].value).toEqual('Hello World')
	})
})
