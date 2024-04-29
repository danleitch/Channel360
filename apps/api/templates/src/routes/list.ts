import express, { Request, Response } from 'express'
import { Templates } from '@models/templates'
import { FilterManager } from '@routes/helpers/FilterManager'
import { SearchQueryManager } from '@routes/helpers/SearchQueryManager'

const router = express.Router({ mergeParams: true })

router.use(async (req: Request, res: Response) => {
	const orgId = req.params.orgId

	const queryParameters = req.query

	const { filter } = queryParameters

	/**
	 * This constructs a search query 🔎
	 */
	const queryManager = new SearchQueryManager(orgId, queryParameters)

	const query = queryManager.constructQuery()

	const templates = await Templates.find(query)

	/**
	 * Filter configured with Filter Manager
	 * @Todo add filter for un-configured templates
	 */

	if (typeof filter === 'string') {
		const filterManager = new FilterManager(templates)
		res.status(200).send(filterManager.applyFilter(filter))
	}

	res.status(200).send(templates)
})

export { router as listTemplatesRouter }
