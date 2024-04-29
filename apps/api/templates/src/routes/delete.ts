import { NotFoundError } from '@channel360/core'
import express, { Request, Response } from 'express'
import { TemplateDeletedPublisher } from '@publishers/template-deleted-publisher'
import { Templates } from '@models/templates'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router({ mergeParams: true })

interface TemplateDeletedEvent {
	id: string
	name: string
	version: number
}

router.use(async (req: Request, res: Response) => {
	// Find the template by ID
	const template = await Templates.findById(req.params.templateId)

	// If the template does not exist, throw a NotFoundError
	if (!template) {
		throw new NotFoundError()
	}

	// Publish the template deletion event
	const eventData: TemplateDeletedEvent = {
		id: template.id,
		name: template.name,
		version: template.version,
	}

	await new TemplateDeletedPublisher(natsWrapper.client).publish(eventData)
	await template.deleteOne()
	res.status(202).send()
})

export { router as deleteTemplatesRouter }
