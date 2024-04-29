import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { Organization, OrganizationDoc } from '@models/organization'
import { NextFunction } from 'express'

jest.mock('../nats-wrapper.ts')

jest.mock('@channel360/core', () => ({
	...jest.requireActual('@channel360/core'),
	validateCognitoToken: (_req: Request, _res: Response, next: NextFunction) =>
		next(),
	requireAuth: (_req: Request, _res: Response, next: NextFunction) => next(),
	requireOrg: () => (_req: Request, _res: Response, next: NextFunction) =>
		next(),
	validateCognitoTokenAndOrganization: (
		_req: Request,
		_res: Response,
		next: NextFunction
	) => next(),
}))
jest.setTimeout(30000)

let mongo: MongoMemoryServer

declare global {
	/* eslint-disable */
	var createOrganization: () => Promise<OrganizationDoc>
	/* eslint-enable */
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

	for (const collection of collections) {
		await collection.deleteMany({})
	}
})

afterAll(async () => {
	await mongo.stop()
	await mongoose.connection.close()
})

global.createOrganization = async () => {
	const organization = Organization.build({
		id: new mongoose.Types.ObjectId().toString(),
		name: 'TestOrganization',
		users: [],
		settings: new mongoose.Types.ObjectId().toString(),
	})

	await organization.save()

	return organization
}
