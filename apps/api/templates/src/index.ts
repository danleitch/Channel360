import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { ServiceInitializer } from '@channel360/core'
import { OrganizationCreatedListener } from '@listeners/organization-created-listener'
import { OrganizationUpdatedListener } from '@listeners/organization-updated-listener'
import { TemplateCreatedListener } from '@listeners/template-created-listener'
import {
	APIKeyCreatedListener,
	APIKeyUpdatedListener,
} from '@listeners/api-key-listener'

const REQUIRED_ENV = [
	'JWT_KEY',
	'MONGO_URI',
	'NATS_URL',
	'CLUSTER_ID',
	'NATS_CLIENT_ID',
	'SENTRY_DSN',
	'AWS_COGNITO_CLIENT_ID',
	'AWS_COGNITO_POOL_ID',
]

const initializer = new ServiceInitializer(natsWrapper, app, REQUIRED_ENV, [
	() => new OrganizationCreatedListener(natsWrapper.client).listen(),
	() => new OrganizationUpdatedListener(natsWrapper.client).listen(),
	() => new APIKeyCreatedListener(natsWrapper.client).listen(),
	() => new APIKeyUpdatedListener(natsWrapper.client).listen(),
	() => new TemplateCreatedListener(natsWrapper.client).listen(),
])
initializer.initialize().then(() => {
	console.log('Templates Service Started 🟢')
})
