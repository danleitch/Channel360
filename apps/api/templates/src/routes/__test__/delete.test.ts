import request from 'supertest'
import { app } from '@app'
import { Templates } from '@models/templates'
import { createTemplate } from './helpers/template-creation'

jest.mock('../../events/publishers/template-deleted-publisher')
describe('DELETE /api/templates/:id', () => {
	it('deletes the template and publishes an event', async () => {
		//Create Organization with user
		const organization = await global.createOrganization()

		//3
		const MockTemplate = await createTemplate('MockTemplate', organization.id)
		await MockTemplate.save()

		await request(app)
			.delete(`/api/templates/${MockTemplate.id}`)
			.send()
			.expect(202)

		// Check that the template was deleted
		const deletedTemplate = await Templates.findById(MockTemplate.id)
		expect(deletedTemplate).toBeNull()
	})
})
