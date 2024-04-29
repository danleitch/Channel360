import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from 'app'
import { Otp } from '@models/otp'
import { natsWrapper } from '../nats-wrapper'
import { config } from 'aws-sdk'
import dotenv from 'dotenv'
import { User } from '@models/user'

dotenv.config({ path: '.env.local' })

jest.mock('../nats-wrapper.ts')

jest.setTimeout(30000)

let mongo: any
declare global {
	var signup: () => Promise<{
		userId: string
		token: string
	}>
	var signInAdmin: () => Promise<string[]>
}


beforeEach(async () => {
	process.env.JWT_KEY = 'userjwttestkey'
	process.env.ADMIN_JWT_KEY = 'adminjwttestkey'

	config.update({
		region: process.env['AWS_COGNITO_REGION']!,
		credentials: {
			accessKeyId: process.env['AWS_ACCESS_KEY_ID']!,
			secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']!,
		},
	})

	process.env.NODE_ENV = 'test'
	mongo = new MongoMemoryServer()
	await mongo.start()
	const mongoUri = await mongo.getUri()
	await mongoose.connect(mongoUri)

	const collections = await mongoose.connection.db.collections()

	for (let collection of collections) {
		await collection.deleteMany({})
	}
})

afterEach(async () => {
	await mongo.stop()
	await mongoose.connection.close()
})

global.signup = async () => {
	const email = 'test@test.com'
	const password = 'password'

	const user = User.build({
		email,
		password,
		firstName: 'Test',
		lastName: 'User',
		mobileNumber: '27847604142',
	})

	await user.save()

	expect(natsWrapper.client.jetstream).toHaveBeenCalled()

	const otp = await Otp.findOne({
		user: user.id,
	})

	const verifyOtp = await request(app)
		.post('/api/users/verify-otp')
		.send({
			userId: user.id,
			otp: otp?.otp,
		})
		.expect(201)

	return {
		userId: user.id,
		token: verifyOtp.body.token,
	}
}

global.signInAdmin = async () => {
	const email = 'test@test.com'
	const password = 'password'

	const response = await request(app)
		.post('/api/admin/signup')
		.send({
			email,
			password,
			firstName: 'Test',
			lastName: 'User',
		})
		.expect(201)

	return response.body.token
}
