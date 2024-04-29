import express, { Request, Response } from 'express'
import { BadRequestError, validateRequest } from '@channel360/core'
import { Organization } from '@models/organization'
import { Log } from '@models/log'
import { query } from 'express-validator'

const router = express.Router({ mergeParams: true })

router.use(
	[
		query('startDate').exists().withMessage('startDate must be provided'),
		query('endDate').exists().withMessage('endDate must be provided'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { orgId } = req.params
		const organization = await Organization.findById(orgId).lean()
		if (!organization) {
			throw new BadRequestError('Organization not found')
		}

		const { startDate, endDate } = req.query

		// Set the response headers to download the CSV file
		res.setHeader('Content-Type', 'text/csv')
		res.setHeader('Content-Disposition', `attachment; filename="logs.csv"`)

		// Write the CSV header
		res.write('Mobile Number,Direction,Status,Message Text,Conversation Id\n')

		// Stream the logs data
		const logsCursor = Log.find({
			organization: orgId,
			createdAt: { $gte: startDate, $lte: endDate },
		})
			.lean()
			.cursor()

		logsCursor.on('data', (log) => {
			// Convert the log data to a CSV row and write it to the response
			const csvRow = `${log.mobileNumber},${log.direction},${log.status},${log.messageText},${log.conversationId}\n`
			res.write(csvRow)
		})

		logsCursor.on('end', () => {
			// End the response stream when all data has been written
			res.end()
		})

		logsCursor.on('error', (error) => {
			// Handle any errors that occur during streaming
			console.error('Error streaming logs:', error)
			res.status(500).json({ error: 'Internal Server Error' })
		})
	}
)

export { router as exportLogsRouter }
