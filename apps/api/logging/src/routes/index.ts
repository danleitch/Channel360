import express, { Request, Response } from 'express'
import { BadRequestError } from '@channel360/core'
import axios from 'axios'
import { Log } from '@models/log'
import { Customer } from '@models/customer'

const router = express.Router({ mergeParams: true})
router.use(async (req: Request, res: Response) => {
	const { orgId } = req.params

	if (!orgId) {
		throw new BadRequestError('Organization not found')
	}

	const { trigger } = req.body
	const handleDelivery = new HandDelivery(req.body, orgId)
	switch (trigger) {
		case 'message:appUser':
			await handleDelivery.inbound()
			break
		case 'message:appMaker':
			await handleDelivery.outbound()
			break
		default:
			console.log('No Match Found')
			break
	}

	res.status(200).send('Logs has been called')
})

export { router as indexLoggingRouter }

interface Data {
	app: {
		_id: string
	}
	appUser: any
	trigger: string
	destination: {
		id: string
	}
	notification: {
		_id: string
	}
	matchResult: {
		appUser: {
			_id: string
		}
		conversation: {
			_id: string
		}
	}
	conversation: {
		_id: string
	}
	messages: [
		{
			text: string
			authorId: string
		}
	]
}

class HandDelivery {
	private readonly data: Data

	private readonly orgId: string

	constructor(data: Data, orgId: string) {
		this.data = data
		this.orgId = orgId
	}

	async inbound() {
		console.log('AppUser: ', this.data)

		let customer = await Customer.findOne({ authorId: this.data.appUser._id })

		if (!customer) {
			let config = {
				method: 'get',
				maxBodyLength: Infinity,
				url: `https://api.smooch.io/v1.1/apps/${this.data.app._id}/appusers/${this.data.appUser._id}`,
				headers: {
					Authorization: `Basic ${new Buffer(
						process.env.SMOOCH_USERNAME + ':' + process.env.SMOOCH_PASSWORD
					).toString('base64')}`,
					'Content-Type': 'application/json',
				},
			}

			await axios
				.request(config)
				.then((response) => {
					console.log(JSON.stringify(response.data))
					// Build Customer
					const client = response.data.appUser.clients.find(
						(c: any) => c.platform === 'whatsapp'
					)

					const customer = Customer.build({
						authorId: this.data.appUser._id,
						mobileNumber: client.raw.from,
						organization: this.orgId,
						firstName: response.data.appUser.givenName || '',
						lastName: response.data.appUser.surname || '',
						fullName: client.raw.profile.name || '',
					})

					customer.save()
					return customer
				})
				.then(async (customer) => {
					const log = Log.build({
						conversationId: this.data.conversation._id,
						mobileNumber: customer!.mobileNumber,
						messageText: this.data.messages[0]!.text,
						direction: 'inbound',
						status: 'success',
						organization: this.orgId,
					})

					await log.save()
				})
				.catch((error) => {
					console.log(error)
				})
		}
		// @ts-ignore
		const log = Log.build({
			conversationId: this.data.conversation._id,
			mobileNumber: customer!.mobileNumber,
			messageText: this.data.messages[0]!.text,
			direction: 'inbound',
			status: 'success',
			organization: this.orgId,
		})

		await log.save()
	}

	async outbound() {
		console.log('AppMaker: ', this.data)
		const log = Log.build({
			conversationId: this.data.conversation._id,
			messageText: this.data.messages[0]!.text,
			direction: 'outbound',
			status: 'success',
			organization: this.orgId,
		})

		return await log.save()
	}
}
