import {
	BadRequestError,
	Listener,
	ReplyEvent,
	SmoochAPI,
	Subjects,
	TemplateSyncEvent,
} from '@channel360/core'
import { JsMsg, NatsConnection } from 'nats'
import { SmoochApp } from '@models/smoochApp'
import { Organization } from '@models/organization'
import { Templates } from '@models/templates'
import { createTags } from '@utilities/createTags'
import { natsWrapper } from '../../nats-wrapper'
import { TemplateImportedPublisher } from '@publishers/template-imported-publisher'

export class TemplateSyncListener extends Listener<TemplateSyncEvent> {
	readonly subject: Subjects.TemplateSync = Subjects.TemplateSync

	stream = 'TEMPLATE-SYNC'

	durableName = 'template-consumer'

	constructor(natsClient: NatsConnection) {
		super(natsClient)
	}

	async onMessage(_data: ReplyEvent['data'], msg: JsMsg) {
		const organizations = await Organization.find({})

		for (const organization of organizations) {
			const smoochApp = await SmoochApp.findOne({
				organization: organization.id,
			})
			if (!smoochApp) {
				continue
			}

			const appId = smoochApp.appId

			const integrationId = smoochApp.integrationId

			if (!appId || !integrationId) {
				continue
			}

			const { data } = await new SmoochAPI(smoochApp.appId).makeGetRequest<{
				data: any
			}>(`/integrations/${smoochApp.integrationId}/messageTemplates?limit=1000`)

			const { templates } = data

			if (!templates) {
				continue
			}

			/**
			 * Loop through templates and update or insert
			 */

			for (const template of templates.messageTemplates) {
				const dataToInsert = {
					organization: organization.id,
					name: template.name,
					namespace: '',
					language: template.language,
					category: template.category,
					status: template.status,
					components: template.components,
					messageTemplateId: template.id,
				}

				const templateDoc = await Templates.findOneAndUpdate(
					{
						organization: organization.id,
						name: template.name,
						language: template.language,
						messageTemplateId: template.id,
					},
					{
						...dataToInsert,
						$setOnInsert: {
							description: 'auto-ingested',
							tags: createTags(template.components),
							enabled: true,
						},
					},
					{ upsert: true, new: true }
				).catch((error: any) => {
					throw new BadRequestError(error.message)
				})

				/**
				 * Publish Template Sync Event
				 */

				if (templateDoc) {
					await new TemplateImportedPublisher(natsWrapper.client).publish({
						id: templateDoc.id,
						organization: templateDoc.organization,
						name: template.name,
						description: templateDoc.description,
						status: templateDoc.status,
						enabled: templateDoc.enabled,
						language: template.language,
						category: templateDoc.category,
						components: templateDoc.components,
						tags: templateDoc.tags,
						messageTemplateId: template.id,
						namespace: templateDoc.namespace,
						version: templateDoc.version,
					})
				}
			}

			console.log('Templates Ingested for: ', organization.name)
		}

		msg.ack()
	}
}
