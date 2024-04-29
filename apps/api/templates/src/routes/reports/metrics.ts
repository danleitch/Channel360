import { GetSuccess } from '@channel360/core'
import express, { Request, Response } from 'express'
import { Templates } from '@models/templates'

const router = express.Router({ mergeParams: true })
router.use(async (req: Request, res: Response) => {
	const orgId = req.params.orgId

	const templates = await Templates.countDocuments({ organization: orgId })

	return new GetSuccess(res).send({ title: 'Templates', count: templates })
})

export { router as templatesReportRouter }
