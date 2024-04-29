import request from 'supertest'
import { app } from 'app'

describe('Validating Signing In A User With Cognito', () => {
	it('should through an error if the fields are invalid', async () => {
		const response = await request(app)
			.post('/webapi/user/signin')
			.send({
			})
			.expect(400)

		expect(response.body.errors[0].message).toEqual('Email must be valid')
		expect(response.body.errors[1].message).toEqual('Password must be provided')
	})

	it('should through an error if the fields are invalid', async () => {
		const response = await request(app)
			.post('/webapi/user/signin')
			.send({
				email: 'doesNotExist@user.com',
				password: 'S!omepassword', 
			})
			.expect(400)

		expect(response.body.errors[0].message).toEqual('Could not find user')
	})
})
