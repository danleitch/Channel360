import request from 'supertest'
import { app } from '@app'
import { Templates } from '@models/templates'

describe('Updating a single template', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should update selected fields "description, namespace, enabled, tags"', async () => {
		const organization = await global.createOrganization()
		const templateUpdate = Templates.build({
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

		await templateUpdate.save()

		const templateId = templateUpdate.id

		const acceptedFields = { enabled: true, description: 'Initial Description' } // set required values

		//PUT Request: to update template
		const response = await request(app)
			.put(`/webapi/org/${organization.id}/templates/${templateId}`)
			.send(acceptedFields)

		expect(response.status).toBe(200)

		const updatedTemplate = await Templates.findById(templateId)

		expect(updatedTemplate!.enabled).toBe(true)
	})
})
