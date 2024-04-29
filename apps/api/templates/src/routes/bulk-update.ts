import { Component, validateRequest } from '@channel360/core'
import express, { Request, Response } from 'express'
import { TemplateInternalUpdatedPublisher } from '@publishers/template-updated-publisher'
import { Templates, TemplatesDoc } from '@models/templates'
import { natsWrapper } from '../nats-wrapper'
import { body } from 'express-validator'

const router = express.Router({ mergeParams: true })

router.use(
	[
		body('templateIds')
			.isArray({ min: 1 })
			.withMessage('templateIds must be provided'),
		body('enabled').isBoolean().withMessage('enabled must be a boolean'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { templateIds, enabled } = req.body

		const orgId = req.params.orgId

		await Templates.updateMany(
			{ organization: orgId, _id: { $in: templateIds } },
			{ $set: { enabled: enabled } },
			{ new: true }
		)

		const findUpdatedTemplate = await Templates.find({
			_id: { $in: templateIds },
		})

		findUpdatedTemplate.map(async (template: TemplatesDoc) => {
			await new TemplateInternalUpdatedPublisher(natsWrapper.client).publish({
				id: template.id,
				organization: template.organization,
				status: template.status,
				tags: template.tags,
				components: template.components as [Component],
				description: template.description,
				enabled: template.enabled,
				version: template.version,
			})
		})
		res.status(201).send({message: "Successfully updated templates"})
	}
)

export { router as bulkUpdateTemplatesRouter }
