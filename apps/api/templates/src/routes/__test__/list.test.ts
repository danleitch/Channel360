import { Templates } from '@models/templates'
import request from 'supertest'
import { app } from '@app'
import { createTemplate } from './helpers/template-creation'

describe('listing configured templates 📜', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	// api/templates/list/${organization.id}?filter=configured
	it('returns all templates that are not broken (have matching tags)', async () => {
		//Create Organization with user
		const organization = await global.createOrganization()

		// This is a Valid template as it has 1 tag in the Head and 2 Tags in the Body
		const A_Valid_Template_With_One_Head_Tag_And_Two_Body_Tags =
			Templates.build({
				tags: {
					head: [
						{
							index: 1,
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
			})

		const A_Valid_Template_With_Head_Format_TEXT_And_No_Tags = Templates.build({
			tags: {
				head: [],
				body: [],
			},
			organization: organization.id,
			name: 'A_Valid_Template_With_Head_Format_TEXT_And_No_Tags',
			description: 'Test Description for a test template',
			namespace: 'TestNamespace',
			language: 'en-US',
			category: 'MARKETING',
			enabled:true,
			status: 'APPROVED',
			components: [
				{
					type: 'HEADER',
					format: 'TEXT',
					text: 'QA TESTING ALERT!!',
				},
				{
					type: 'BODY',
					text: 'This is a test template with no merge tags and CTA Button to our Staging Environment. ',
				},
				{
					type: 'FOOTER',
					text: '(C) Channel Mobile Team. Stop to optout. ',
				},
			],
		})

		// //This is a Invalid Template as it does not have any tags at all
		const A_InValid_Template_With_No_Tags = Templates.build({
			tags: {
				head: [
					{
						index: 1,
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
			organization: organization.id,
			name: 'MockTemplate',
			description: 'Mock description for a mock template',
			namespace: 'MockNamespace',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled:true,
			components: [
				{
					type: 'HEADER',
					format: 'TEXT',
					text: 'MOCK ALERT!!',
				},
				{
					type: 'BODY',
					text: 'This is a mock template with no call-to-action button. ',
				},
				{
					type: 'FOOTER',
					text: '(C) Mock Team. Stop to opt out. ',
				},
			],
		})

		const A_InValid_Template_With_Tags_But_Empty_Tag_Array = Templates.build({
			tags: {
				head: [],
				body: [],
			},
			organization: organization.id,
			name: 'A_InValid_Template_With_Tags_But_Empty_Tag_Array',
			description: 'Mock description for a mock template',
			namespace: 'MockNamespace',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled:true,
			components: [
				{
					type: 'HEADER',
					format: 'TEXT',
					text: 'MOCK ALERT!! {{1}}',
				},
				{
					type: 'BODY',
					text: 'This is {{1}} a mock template with no call-to-action button. ',
				},
				{
					type: 'FOOTER',
					text: '(C) Mock Team. Stop to opt out. ',
				},
			],
		})

		const A_InValid_Template_With_Head_Format_Image_But_TagType_Is_Text =
			Templates.build({
				tags: {
					head: [
						{
							type: 'subscriber-field',
							fields: 'firstName',
						},
					],
					body: [],
				},
				organization: organization.id,
				name: 'A_InValid_Template_With_Head_Format_Image_But_TagType_Is_Text',
				description: 'Mock description for a mock template',
				namespace: 'MockNamespace',
				language: 'en-US',
				category: 'MARKETING',
				status: 'APPROVED',
				enabled:true,
				components: [
					{
						type: 'HEADER',
						format: 'IMAGE',
					},
					{
						type: 'BODY',
						text: 'This is a mock template with no call-to-action button. ',
					},
					{
						type: 'FOOTER',
						text: '(C) Mock Team. Stop to opt out. ',
					},
				],
			})

		const A_InValid_Template_With_Head_Format_Image_But_No_Tags =
			Templates.build({
				tags: {
					head: [],
					body: [],
				},
				enabled:true,
				organization: organization.id,
				name: 'A_InValid_Template_With_Head_Format_Image_But_No_Tags',
				description: 'Mock description for a mock template',
				namespace: 'MockNamespace',
				language: 'en-US',
				category: 'MARKETING',
				status: 'APPROVED',
				components: [
					{
						type: 'HEADER',
						format: 'IMAGE',
					},
					{
						type: 'BODY',
						text: 'This is a mock template with no call-to-action button. ',
					},
					{
						type: 'FOOTER',
						text: '(C) Mock Team. Stop to opt out. ',
					},
				],
			})

		await A_Valid_Template_With_One_Head_Tag_And_Two_Body_Tags.save()
		await A_Valid_Template_With_Head_Format_TEXT_And_No_Tags.save()
		await A_InValid_Template_With_No_Tags.save()
		await A_InValid_Template_With_Tags_But_Empty_Tag_Array.save()
		await A_InValid_Template_With_Head_Format_Image_But_TagType_Is_Text.save()
		await A_InValid_Template_With_Head_Format_Image_But_No_Tags.save()

		const response = await request(app)
			.get(`/api/templates/list/${organization.id}?filter=configured`)
			.send()
			.expect(200)

		const templates = response.body

		expect(templates.length).toEqual(2)
	})

	it("tests templates with Document as a component's format", async () => {
		//Create Organization with user
		const organization = await global.createOrganization()

		const A_InValid_Template_With_Head_Format_Is_Document = Templates.build({
			tags: {
				head: [
					{
						type: 'image',
						url: 'https://channel360-template-tags.s3.af-south-1.amazonaws.com/2023-03-08T06%3A33%3A13.646Z-EL_SNU_M4_DAY6_WA%20-%20updated.jpg',
					},
				],
				body: [],
			},
			organization: organization.id,
			name: 'A_InValid_Template_With_Head_Format_Is_Document',
			description: 'Test Description for a test template',
			namespace: 'TestNamespace',
			enabled:true,
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			components: [
				{
					type: 'HEADER',
					format: 'DOCUMENT',
				},
			],
		})

		const A_Valid_Template_With_Head_Format_Is_Document = Templates.build({
			tags: {
				head: [
					{
						document: {
							link: 'https://channel360-template-tags.s3.af-south-1.amazonaws.com/2023-03-28T09%3A07%3A53.742Z-Fibonacci%20Logic.pdf',
							filename: 'Fibonacci Logic.pdf',
						},
						type: 'document',
					},
				],
				body: [],
			},
			organization: organization.id,
			name: 'A_Valid_Template_With_Head_Format_Is_Document',
			description: 'Test Description for a test template',
			namespace: 'TestNamespace',
			language: 'en-US',
			enabled:true,
			status: 'APPROVED',
			category: 'MARKETING',
			components: [
				{
					type: 'HEADER',
					format: 'DOCUMENT',
				},
			],
		})

		await A_Valid_Template_With_Head_Format_Is_Document.save()
		await A_InValid_Template_With_Head_Format_Is_Document.save()

		const response = await request(app)
			.get(`/api/templates/list/${organization.id}?filter=configured`)
			.send()
			.expect(200)

		const templates = response.body

		// Should only return 1 template as the other 2 are broken
		expect(templates.length).toEqual(1)
	})

	// api/templates/list/${organization.id}
	it('returns all templates', async () => {
		const organization = await global.createOrganization()

		//Create Template with Tags
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
		const response = await request(app)
			.get(
				`/api/templates/list/${organization.id}?filter=configured&status=enabled`
			)
			.send()
			.expect(200)

		const templates = response.body

		for (let i = 0; i < templates.length; i++) {
			expect(templates.length).toEqual(3)
		}
	})
})

describe('Enable Templates API', () => {
	it('returns all templates that are configured and enabled', async () => {
		const organization = await global.createOrganization()

		//enabled true
		const validTemplateEnabled = Templates.build({
			tags: {
				head: [],
				body: [],
			},
			organization: organization.id,
			name: 'ValidTemplateEnabled',
			description: 'Test Description for a test template',
			namespace: 'TestNamespace',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled: true,
			components: [],
		})

		//enabled false
		const validTemplateDisabled = Templates.build({
			tags: {
				head: [],
				body: [],
			},
			organization: organization.id,
			name: 'ValidTemplateDisabled',
			description: 'Test Description for a test template',
			namespace: 'TestNamespace',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled: false,
			components: [],
		})

		await validTemplateEnabled.save()
		await validTemplateDisabled.save()
		const orgId = organization.id
		const response = await request(app)
			.get(`/webapi/org/${orgId}/templates/list?filter=configured&enabled=true`)
			.send()
			.expect(200)

		const templates = response.body

		expect(templates.length).toEqual(1)
		expect(templates[0].enabled).toEqual(true)
		expect(templates[0].id).toBeDefined();
	})

	it('returns all templates that are disabled', async () => {
		const organization = await global.createOrganization()

		//enabled true
		const validTemplateEnabled = Templates.build({
			tags: {
				head: [],
				body: [],
			},
			organization: organization.id,
			name: 'ValidTemplateEnabled',
			description: 'Test Description for a test template',
			namespace: 'TestNamespace',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled: true,
			components: [],
		})

		//enabled false
		const validTemplateDisabled = Templates.build({
			tags: {
				head: [],
				body: [],
			},
			organization: organization.id,
			name: 'ValidTemplateDisabled',
			description: 'Test Description for a test template',
			namespace: 'TestNamespace',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled: false,
			components: [],
		})

		await validTemplateEnabled.save()
		await validTemplateDisabled.save()

		const orgId = organization.id
		const response = await request(app)
			.get(
				`/webapi/org/${orgId}/templates/list?filter=configured&enabled=false`
			)
			.send()
			.expect(200)

		const templates = response.body

		expect(templates.length).toEqual(1)
		expect(templates[0].enabled).toEqual(false)
	})

	it('returns all templates that are configured', async () => {
		const organization = await global.createOrganization()
		//enabled true
		const validTemplateEnabled = Templates.build({
			tags: {
				head: [],
				body: [],
			},
			organization: organization.id,
			name: 'ValidTemplateEnabled',
			description: 'Test Description for a test template',
			namespace: 'TestNamespace',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled: true,
			components: [],
		})

		//enabled false
		const validTemplateDisabled = Templates.build({
			tags: {
				head: [],
				body: [],
			},
			organization: organization.id,
			name: 'ValidTemplateDisabled',
			description: 'Test Description for a test template',
			namespace: 'TestNamespace',
			language: 'en-US',
			category: 'MARKETING',
			status: 'APPROVED',
			enabled: false,
			components: [],
		})
		await validTemplateEnabled.save()
		await validTemplateDisabled.save()

		const orgId = organization.id

		const response = await request(app)
			.get(`/webapi/org/${orgId}/templates/list?filter=configured`)
			.send()

		expect(response.status).toEqual(200)
	})
})
