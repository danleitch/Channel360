import request from "supertest";
import { app } from "app";

describe('Validating Verify User Account With Cognito', () => {
	it('should through an error if the fields are invalid', async () => {
		const response = await request(app)
			.post('/webapi/user/verify-account')
			.send({
			})
			.expect(400)

		expect(response.body.errors[0].message).toEqual('Email must be valid')
		expect(response.body.errors[1].message).toEqual('OTP must be provided')
	})
})
