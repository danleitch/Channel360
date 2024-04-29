import { Component, NotFoundError, validateRequest } from '@channel360/core'
import express, { Request, Response } from 'express'
import { TemplateInternalUpdatedPublisher } from '@publishers/template-updated-publisher'
import { Templates } from '@models/templates'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router({ mergeParams: true })
const acceptedFields = ['description', 'namespace', 'enabled', 'tags']

// Update Template by ID
router.use(validateRequest, async (req: Request, res: Response) => {
	const update: { [key: string]: string } = {}

	const template = await Templates.findById(req.params.templateId)

	if (!template) {
		throw new NotFoundError()
	}

	// Create update query based on passed fields.
	Object.keys(req.body).forEach((key) => {
		if (acceptedFields.includes(key)) {
			update[key] = req.body[key]
		}
	})

	template.set(update)
	await template.save()

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

	res.status(200).send(template)
})

export { router as updateTemplatesRouter }
