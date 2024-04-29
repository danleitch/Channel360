import express, { Request, Response } from 'express'
import { BadRequestError, ModelFinder, SmoochAPI } from '@channel360/core'
import { SmoochApp } from '@models/smoochApp'
import { Templates } from '@models/templates'
import { natsWrapper } from '../nats-wrapper'
import { createTags } from '@utilities/createTags'
import { TemplateImportedPublisher } from '@publishers/template-imported-publisher'

const router = express.Router({ mergeParams: true })

router.use(async (req: Request, res: Response) => {
	/**
	 * Find Smooch App
	 */
	const smoochApp = await ModelFinder.findOneOrFail(
		SmoochApp,
		{
			organization: req.params.orgId,
		},
		'Smooch App not found'
	)

	/**
	 * Get templates from Smooch
	 */

	const { data } = await new SmoochAPI(smoochApp.appId).makeGetRequest<{
		data: any
	}>(`/integrations/${smoochApp.integrationId}/messageTemplates?limit=1000`)

	/**
	 * Loop through templates and update or insert
	 */

	async function updateAndPublishTemplates() {
		const bulkOps = data.messageTemplates.map((template: any) => ({
			updateOne: {
				filter: {
					organization: req.params.orgId,
					name: template.name,
					language: template.language,
					messageTemplateId: template.id,
				},
				update: {
					$set: {
						organization: req.params.orgId,
						name: template.name,
						namespace: '',
						language: template.language,
						category: template.category,
						status: template.status,
						components: template.components,
						messageTemplateId: template.id,
					},
					$setOnInsert: {
						description: 'auto-ingested',
						tags: createTags(template.components),
						enabled: true,
					},
				},
				upsert: true,
			},
		}))

		try {
			const result = await Templates.bulkWrite(bulkOps, { ordered: false })
			console.log(result)

			// After bulkWrite, fetch the updated or inserted templates
			// This is a simplified approach; you might need a more complex logic
			// to fetch exactly what was updated or inserted
			const updatedOrInsertedTemplates = await Templates.find({
				organization: req.params.orgId,
				messageTemplateId: { $in: data.messageTemplates.map((t: any) => t.id) },
			})

			// Publish events for each updated or inserted template
			for (const templateDoc of updatedOrInsertedTemplates) {
				await new TemplateImportedPublisher(natsWrapper.client).publish({
					id: templateDoc.id,
					organization: templateDoc.organization,
					name: templateDoc.name,
					description: templateDoc.description,
					status: templateDoc.status,
					enabled: templateDoc.enabled,
					language: templateDoc.language,
					category: templateDoc.category,
					components: templateDoc.components,
					tags: templateDoc.tags,
					messageTemplateId: templateDoc.messageTemplateId,
					namespace: templateDoc.namespace,
					version: templateDoc.version,
				})
			}
		} catch (error: any) {
			throw new BadRequestError(error.message)
		}
	}

	updateAndPublishTemplates().catch(console.error)
	/**
	 * Respond with success
	 */

	res.status(202).send({ message: 'Templates have synced' })
})

export { router as syncTemplatesRouter }
