import { BadRequestError } from '@channel360/core'
import express, { Request, Response } from 'express'
import { Log } from '@models/log'
import { Organization } from '@models/organization'

const router = express.Router({mergeParams: true})

// Eg: GET {{url}}/api/logging/{{orgId}}?order=desc
router.use(async (req: Request, res: Response) => {
	const { orgId } = req.params

	// Checking if the organization corresponding to the given ID exists.
	const organization = await Organization.findById(orgId).lean()
	if (!organization) {
		throw new BadRequestError('Organization not found')
	}

	// Parsing query parameters for pagination and search.
	const page = parseInt(req.query.page as string) || 1
	const limit = parseInt(req.query.limit as string) || 50
	const search = (req.query.search as string) || ''

	// Base query to filter logs by the organization.
	const baseQuery = { organization: orgId }

	// Constructing the search query based on provided search term.
	const searchQuery = search
		? {
				...baseQuery,
				$or: [
					{ messageText: { $regex: new RegExp(search, 'i') } },
					{ mobileNumber: { $regex: new RegExp(search, 'i') } },
					{ direction: { $regex: new RegExp(search, 'i') } },
					// Additional fields for search can be added here.
				],
		  }
		: baseQuery

	// Check if an order parameter is provided and if it's valid.
	if (req.query.order && req.query.order !== 'desc') {
		throw new BadRequestError(
			"Invalid parameter provided. Accepted values for 'order' are [desc]. eg: /api/logging/{orgId}?order=desc"
		)
	}

	// Determine the sorting order based on the 'order' query parameter.
	const sortOrder = req.query.order === 'desc' ? -1 : 1 // default is ascending (oldest to newest).

	// Fetch logs with applied search, sorting, and pagination.
	const logs = await Log.find(searchQuery)
		.sort({ createdAt: sortOrder }) // Sorting logs based on the 'createdAt' timestamp.
		.skip((page - 1) * limit)
		.limit(limit)

	const totalLogs = await Log.countDocuments(searchQuery)

	res.status(200).send({ logs, totalLogs })
})

export { router as getLogsRouter }
