import express, { Router } from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import {
	currentAdmin,
	currentUser,
	errorHandler, httpPerformanceObserver,
	NotFoundError
} from "@channel360/core";

import cors from 'cors'
import { exportLogsRouter } from '@routes/export'
import { indexLoggingRouter } from '@routes/index'
import { getLogsRouter } from '@routes/getLogs'
import { register } from "prom-client";

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.set('trust proxy', true)
app.use(json())


/********* Record GRAFANA Metrics *************************/

app.use(httpPerformanceObserver);

app.get("/metrics", async (_req, res) => {
	res.set("Content-Type", register.contentType);
	res.end(await register.metrics());
});

/********************************************************/


/**
 * API (Legacy)
 */

const apiRouter = Router({ mergeParams: true })

apiRouter.use(currentAdmin)
apiRouter.use(currentUser)

apiRouter.get('/export', exportLogsRouter)
apiRouter.get('', getLogsRouter)
apiRouter.post('', indexLoggingRouter)

app.use('/api/logging/:orgId', apiRouter)

/**
 * WebAPI (New)
 */
const webApiRouter = Router({ mergeParams: true })

webApiRouter.get('/export', exportLogsRouter)
webApiRouter.get('', getLogsRouter)
webApiRouter.post('', indexLoggingRouter)

app.use('/webapi/org/:orgId/logging', webApiRouter)

app.all('*', async (_req, _res) => {
	throw new NotFoundError()
})

app.use(errorHandler)

export { app }
