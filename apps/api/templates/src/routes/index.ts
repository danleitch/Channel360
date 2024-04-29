import { NotFoundError, validateRequest } from '@channel360/core'
import { Request, Response, Router } from 'express'
import { Templates } from '@models/templates'

const router = Router({ mergeParams: true })

router.use(validateRequest, async (req: Request, res: Response) => {
	const { orgId, templateName } = req.params

	// Fetch the template by its name and associated organization
	const template = await Templates.findOne({
		name: templateName,
		organization: orgId,
	})

	if (!template) {
		throw new NotFoundError()
	}

	// Return the found template
	res.status(200).send(template)
})

export { router as indexTemplateRouter }
