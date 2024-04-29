import mongoose from 'mongoose'
import { TemplateAttrs, Templates } from '@models/templates'
import { SmoochApp } from '@models/smoochApp'

interface ISeeder {
	seed(orgId: string): Promise<void>
}

export class TemplateSyncSeeder implements ISeeder {
	async seed(orgId: string) {
		/**
		 * Create SmoochApp
		 */
		const smoochApp = SmoochApp.build({
			appId: new mongoose.Types.ObjectId().toString(),
			name: 'Channel360',
			organization: orgId,
			appToken: new mongoose.Types.ObjectId().toString(),
			settings: {},
		})

		await smoochApp.save()

		/**
		 * Create many Templates
		 */

		const templates: TemplateAttrs[] = [
			{
				organization: orgId,
				name: 'template_1',
				description: 'Template 1',
				namespace: 'Template 1',
				language: 'en',
				category: 'MARKETING',
				components: [],
				tags: {
					head: [],
					body: [],
				},
				status: 'APPROVED',
				enabled: true,
				messageTemplateId: '1082332639632362',
			},
			{
				organization: orgId,
				name: 'template_2',
				description: 'Template 2',
				namespace: 'Template 2',
				language: 'en',
				category: 'MARKETING',
				components: [
					{
						type: 'HEADER',
						text: 'Hello',
					},
					{
						type: 'BODY',
						text: 'World',
					},
				],
				tags: {
					head: [
						{
							type: 'hard-coded',
							value: 'Hello',
						},
					],
					body: [
						{
							index: 1,
							type: 'hard-coded',
							value: 'World',
						},
					],
				},
				status: 'PENDING',
				enabled: true,
				messageTemplateId: '721242083286764',
			},
			{
				organization: orgId,
				name: 'template_3',
				description: 'Template 3',
				namespace: 'Template 3',
				language: 'en',
				category: 'MARKETING',
				components: [],
				tags: {
					head: [],
					body: [],
				},
				status: 'REJECTED',
				enabled: true,
				messageTemplateId: '4051996725027365',
			},
		]

		for (const template of templates) {
			const templateDoc = Templates.build(template)
			await templateDoc.save()
		}
	}
}
