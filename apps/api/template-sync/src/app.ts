import express, { NextFunction, Router, urlencoded } from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import {
	currentUser,
	errorHandler,
	NotFoundError,
	requireAuth,
	requireOrg, validateAPIKey, validateCognitoTokenAndOrganization
} from "@channel360/core";

import cors from 'cors'
import * as Sentry from '@sentry/node'
import { syncTemplatesRouter } from '@routes/sync-templates'
import { Organization } from '@models/organization'

const app = express()
app.use(Sentry.Handlers.requestHandler())

app.use(Sentry.Handlers.tracingHandler())

app.use(Sentry.Handlers.errorHandler())

const setupMiddlewares = (): void => {
	app.use(cors({ origin: true, credentials: true }))
	app.set('trust proxy', true)
	app.use(json({ limit: '50mb' }))
	app.use(urlencoded({ limit: '50mb', extended: false }))
	app.use(currentUser)
}

// Setup function for routers.
const setupRoutes = (): void => {
	const apiRouter = Router({ mergeParams: true })
	apiRouter.post('/:orgId', requireOrg(Organization), syncTemplatesRouter)

	app.use('/api/ingest-templates', requireAuth, apiRouter)

	const webApiRouter = Router({ mergeParams: true });

	webApiRouter.post("/templates/refresh", syncTemplatesRouter);

	app.use(
		"/webapi/org/:orgId/whatsapp",
		validateCognitoTokenAndOrganization,
		webApiRouter
	);

	app.use(
		"/v1.1/org/:orgId/whatsapp",
		validateAPIKey,
		webApiRouter
	);

}

setupMiddlewares()
setupRoutes()

// Catch-all route handler for any routes not specified above.
app.all('*', (_req, _res, next: NextFunction) => {
	next(new NotFoundError())
})

app.use(errorHandler)

export { app }
