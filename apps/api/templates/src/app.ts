import express, { NextFunction, Router, urlencoded } from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cors from 'cors'
import { indexTemplateRouter } from '@routes/index'
import { deleteTemplatesRouter } from '@routes/delete'
import { listTemplatesRouter } from '@routes/list'
import { bulkUpdateTemplatesRouter } from '@routes/bulk-update'
import { updateTemplatesRouter } from '@routes/update'
import { uploadRouter } from '@routes/upload'
import { templatesReportRouter } from '@routes/reports/metrics'
import * as Sentry from '@sentry/node'
import {
	currentUser,
	errorHandler,
	NotFoundError,
	requireAuth,
	requireOrg,
	validateAPIKey,
	validateCognitoTokenAndOrganization,
} from '@channel360/core'
import { Organization } from '@models/organization'

const app = express()
app.use(Sentry.Handlers.requestHandler())

app.use(Sentry.Handlers.tracingHandler())

app.use(Sentry.Handlers.errorHandler())

// Setup function for middleware configurations.
const setupMiddlewares = (): void => {
	app.use(cors({ origin: true, credentials: true }))
	app.set('trust proxy', true)
	app.use(json({ limit: '50mb' }))
	app.use(urlencoded({ limit: '50mb', extended: false }))
	app.use(currentUser)
}

const setupRoutes = (): void => {
	/**
	 * API Routes
	 */

	app.use(uploadRouter)

	const apiRouter = Router({ mergeParams: true })

	apiRouter.post(
		'/reports/:orgId',
		requireOrg(Organization),
		templatesReportRouter
	)
	apiRouter.get('/list/:orgId', requireOrg(Organization), listTemplatesRouter)
	apiRouter.get(
		'/:orgId/:templateName',
		requireOrg(Organization),
		indexTemplateRouter
	)
	apiRouter.put('/:templateId', updateTemplatesRouter)
	apiRouter.delete('/:templateId', deleteTemplatesRouter)

	/**
	 * WebAPI
	 */

	const webapiRouter = Router({ mergeParams: true })

	webapiRouter.get('/report', templatesReportRouter)
	webapiRouter.get('/list', listTemplatesRouter)
	webapiRouter.get('/:templateName', indexTemplateRouter)
	webapiRouter.put('/:templateId', updateTemplatesRouter)
	webapiRouter.delete('/:templateId', deleteTemplatesRouter)
	webapiRouter.put('', bulkUpdateTemplatesRouter)

	app.use('/api/templates', requireAuth, apiRouter)

	app.use('/v1.1/org/:orgId/templates', validateAPIKey, webapiRouter)

	app.use(
		'/webapi/org/:orgId/templates',
		validateCognitoTokenAndOrganization,
		webapiRouter
	)
}

setupMiddlewares()
setupRoutes()

app.all('*', (req, res, next: NextFunction) => {
	next(new NotFoundError())
})

app.use(errorHandler)

export { app }
