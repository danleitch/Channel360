import { app } from 'app'
import request from 'supertest'

describe('Validating A Refresh Token Request With Cognito', () => {
	it('should return an error if the fields are invalid', async () => {
		const response = await request(app)
			.post('/webapi/user/refresh-token')
			.send({})
			.expect(400)

		expect(response.body.errors[0].message).toEqual('cognitoId must be valid')
		expect(response.body.errors[1].message).toEqual('refreshToken must be valid')
	})
})
