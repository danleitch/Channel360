import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { NextFunction, Request, Response } from 'express'
import { Organization, OrganizationDoc } from '@models/organization'

jest.mock('../nats-wrapper.ts')

jest.mock('@channel360/core', () => ({
	...jest.requireActual('@channel360/core'),
	requireAuth: (_req: Request, _res: Response, next: NextFunction) => next(),
	requireOrg:
		(_orgModel: any) => (_req: Request, _res: Response, next: NextFunction) =>
			next(),
	SmoochAPI: jest.fn().mockImplementation(() => ({
		makeGetRequest: jest.fn().mockResolvedValue({
			status: 200,
			data: {
				messageTemplates: [
					// Templates
					{
						id: '1093005095344555',
						name: 'template_4',
						language: 'en-US',
						category: 'MARKETING',
						status: 'APPROVED',
						components: [
							{
								type: 'BODY',
								text: 'Hello World',
							},
						],
					},
					{
						id: '721242083286764',
						name: 'template_2',
						language: 'en',
						category: 'MARKETING',
						status: 'APPROVED',
						components: [
							{
								type: 'HEADER',
								text: 'Hello',
							},
							{
								type: 'BODY',
								text: 'World',
							},
						],
					},
				],
			},
		}),
	})),
}))

jest.setTimeout(60000)

let mongo: any

declare global {
	var createOrganization: () => Promise<OrganizationDoc>
}

beforeAll(async () => {
	process.env.JWT_KEY = 'asdf'
	process.env.NODE_ENV = 'test'
	mongo = new MongoMemoryServer()
	await mongo.start()
	const mongoUri = await mongo.getUri()
	await mongoose.connect(mongoUri)
})

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections()

	for (let collection of collections) {
		await collection.deleteMany({})
	}
})

afterAll(async () => {
	await mongo.stop()
	await mongoose.connection.close()
})

global.createOrganization = async () => {
	const organization = Organization.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		name: 'Channel360',
		users: [],
		settings: new mongoose.Types.ObjectId().toHexString(),
	})

	await organization.save()

	return organization
}
