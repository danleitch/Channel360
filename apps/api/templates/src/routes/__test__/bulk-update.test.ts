import request from 'supertest'
import { app } from '@app'
import { Templates } from '@models/templates'

describe('bulk updating a selected list of templates', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should set selected templates to enabled', async () => {
		const organization = await global.createOrganization()
		const templateBulkUpdate = Templates.build({
			tags: {
				head: [],
				body: [],
			},
			organization: organization.id,
			name: 'update_test_template',
			description: 'First Initial Description',
			namespace: 'TestNamespace',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled: false,
			components: [],
		})

		const templateBulkUpdate2 = Templates.build({
			tags: {
				head: [],
				body: [],
			},
			organization: organization.id,
			name: 'update_test_template2',
			description: 'Second Initial Description',
			namespace: 'TestNamespace',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled: false,
			components: [],
		})
		const templateBulkUpdate3 = Templates.build({
			tags: {
				head: [],
				body: [],
			},
			organization: organization.id,
			name: 'update_test_template3',
			description: 'Third Initial Description',
			namespace: 'TestNamespace',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled: false,
			components: [],
		})

		await templateBulkUpdate.save()
		await templateBulkUpdate2.save()
		await templateBulkUpdate3.save()

		const templateIds = [templateBulkUpdate.id, templateBulkUpdate2.id]

		//PUT Request: to update template
		const response = await request(app)
			.put(`/webapi/org/${organization.id}/templates`)
			.send({ templateIds, enabled: true })

		expect(response.status).toBe(201)

		const updatedTemplates = await Templates.find({ _id: { $in: templateIds } })

		updatedTemplates.forEach((template) => {
			expect(template.enabled).toBe(true)
		})

		const notUpdatedTemplate = await Templates.findById(templateBulkUpdate3.id)

		expect(notUpdatedTemplate!.enabled).toEqual(false)
	})
})
