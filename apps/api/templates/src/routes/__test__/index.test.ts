import request from 'supertest'
import { app } from '@app'
import { createTemplate } from './helpers/template-creation'

describe('Get specific object template returned, /api/templates/organization id/template Name', () => {
	it('Find and returns template shape using ID', async () => {
		//Create Organization with user
		const organization = await global.createOrganization()

		// Create Templates
		//1
		const marketingTemplate = await createTemplate(
			'TestTemplate',
			organization.id
		)
		await marketingTemplate.save()

		//2
		const SampleTemplate = await createTemplate(
			'SampleTemplate',
			organization.id
		)
		await SampleTemplate.save()

		//3
		const MockTemplate = await createTemplate('MockTemplate', organization.id)
		await MockTemplate.save()

		const ReturnedTemplate = await request(app)
			.get(`/api/templates/${organization.id}/${MockTemplate.name}`)
			.send()
			.expect(200)

		expect(typeof ReturnedTemplate.body).toBe('object')
	})
})
