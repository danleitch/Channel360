import { faker } from "@faker-js/faker";
import request from "supertest";
import { app } from "app";

describe('Validating Sign Up User Account With Cognito', () => {
	it('should through an error if the fields are invalid', async () => {
		const response = await request(app)
			.post('/webapi/user/signup')
			.send({
				mobileNumber: faker.phone.number("################"),
				email: "invalid email",
				password: "1234",
			})
			.expect(400)

		expect(response.body.errors[0].message).toEqual('First name must be valid')
		expect(response.body.errors[1].message).toEqual('Last name must be valid')
		expect(response.body.errors[2].message).toEqual('Mobile Number must be valid')
		expect(response.body.errors[3].message).toEqual('Mobile Number must start with a valid prefix')
		expect(response.body.errors[4].message).toEqual('Email must be valid')
		expect(response.body.errors[5].message).toEqual('Password must be between 8 and 20 characters')
	})
})
