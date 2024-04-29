import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { ServiceInitializer } from '@channel360/core'
import { TemplateSyncListener } from '@listeners/sync-template-listener'
import { SmoochAppCreatedListener } from '@listeners/smooch-app-created-listener'
import { SmoochAppDeletedListener } from '@listeners/smooch-app-deleted-listener'

const REQUIRED_ENV = [
	'JWT_KEY',
	'MONGO_URI',
	'NATS_URL',
	'CLUSTER_ID',
	'NATS_CLIENT_ID',
	'SENTRY_DSN',
	"AWS_COGNITO_CLIENT_ID",
	"AWS_COGNITO_POOL_ID",
	"SMOOCH_USERNAME",
	"SMOOCH_PASSWORD"
]

const initializer = new ServiceInitializer(natsWrapper, app, REQUIRED_ENV, [
	() =>
		new TemplateSyncListener(natsWrapper.client)
			.listen()
			.catch((e) =>
				console.log('Could not register listener: TemplateSyncListener ❌', e)
			),
	() =>
		new SmoochAppCreatedListener(natsWrapper.client)
			.listen()
			.catch((e) =>
				console.log('Could not register listener: SmoochAppCreatedListener ❌', e)
			),
	() =>
		new SmoochAppDeletedListener(natsWrapper.client)
			.listen()
			.catch((e) =>
				console.log('Could not register listener: SmoochAppDeletedListener ❌', e)
			),
])
initializer.initialize().then(() => {
	console.log('Template Sync Service Started 🟢')
})
