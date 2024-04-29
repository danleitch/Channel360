import request from 'supertest'
import { app } from 'app'

jest.mock('@controllers/UserSignUpController', () => {
	return {
		UserSignUpController: jest.fn().mockImplementation(() => {
			return {
				signUp: jest.fn().mockResolvedValue({ message: 'Signup successful' }), // Mock successful response
			}
		}),
	}
})

describe('Signup Validation Middleware', () => {
	it('should validate mobile number with correct prefix', async () => {
		const response = await request(app).post('/webapi/user/signup').send({
			firstName: 'John',
			lastName: 'Doe',
			mobileNumber: '0656225778', // Correct prefix
			email: 'john.doe@example.com',
			password: 'securePassword123',
		})
		expect(response.statusCode).toBe(400)
		expect(response.body.errors[0]).toEqual({
			field: 'mobileNumber',
			message: 'Mobile Number must start with a valid prefix',
		})
	})
})
