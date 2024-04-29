import {
	errorHandler,
	requireAdminGroup,
	validateCognitoToken,
} from '@channel360/core'
import express from 'express'
import request from 'supertest'
import { json } from 'body-parser'
import { faker } from '@faker-js/faker'
import { lastEmail } from '@utility/lastEmail'
import { createEtherealAccount } from '@utility/createEtheralAccount'
import { V1_GroupRouter } from '@routes/group'
import { V1_SignupRouter } from '@routes/signup'
import { V1_VerifyAccountRouter } from '@routes/verify-account'
import { V1_SigninRouter } from '@routes/signin'
import { V1_SignOutRouter } from '@routes/signout'
import { V1_RefreshTokenRouter } from '@routes/refresh-token'
import { V1_PasswordRecoveryRouter } from '@routes/password-recovery'
import { V1_ResendVerificationRouter } from '@routes/resend-verification'

jest.setTimeout(60000)

describe('AWS Cognito Integration 📦🛡', () => {
	/**
	 * Setting Up Express App And Declaring Routes 🚀🏁
	 */
	const testApp = express()

	testApp.use(json())
	testApp.use(V1_GroupRouter)
	testApp.use(V1_SignupRouter)
	testApp.use(V1_VerifyAccountRouter)
	testApp.use(V1_SigninRouter)
	testApp.use(V1_SignOutRouter)
	testApp.use(V1_RefreshTokenRouter)
	testApp.use(V1_PasswordRecoveryRouter)
	testApp.use(V1_ResendVerificationRouter)

	/**
	 * Declaring a protected route for testing purposes 🛡
	 */
	testApp.get(
		'/admin/protected',
		validateCognitoToken,
		requireAdminGroup,
		(_req, res) => {
			// @ts-ignore
			res.status(200).send({ message: 'Admin protected route' })
		}
	)
	testApp.get('/protected', validateCognitoToken, (_req, res) => {
		// @ts-ignore
		res.status(200).send({ message: 'Token is valid' })
	})

	testApp.use(errorHandler)

	it('Validates the Cognito authentication flow 🧪🔀', async () => {
		/**
		 * Sign Up a User 📝
		 * This section validates that a user has signed up with cognito correctly with the generated Ethereal Account
		 */
		const { email, password } = await createEtherealAccount()

		const signUpResponse = await request(testApp)
			.post('/webapi/user/signup')
			.send({
				email: email,
				mobileNumber: faker.phone.number('+27#########'),
				password: 'Test1234!',
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
			})

		/**
		 * Sign Up User Assertion 🧪
		 */

		expect(signUpResponse.status).toEqual(200)
		expect(signUpResponse.body).toHaveProperty('UserConfirmed')

		// Wait for the email to be sent
		await new Promise((resolve) => setTimeout(resolve, 5000))

		/**
		 * Trigger Resend OTP 📨
		 */
		const resendVerificationResponse = await request(testApp)
			.post('/webapi/user/resend-otp')
			.send({
				email: email,
			})

		/**
		 * Resend OTP Assertion 🧪
		 */

		expect(resendVerificationResponse.status).toEqual(200)
		expect(resendVerificationResponse.body).toHaveProperty(
			'CodeDeliveryDetails'
		)

		// Fetch the last email
		const emailData = await lastEmail(email, password)

		if (!emailData) {
			throw new Error('No email found')
		}

		/**
		 * Verify the OTP 🔐
		 * This section extract the OTP from the last email from the ethereal account
		 */

		const otpMatch = /Your confirmation code is (\d+)/.exec(
			<string>emailData.html!
		)
		if (!otpMatch) {
			throw new Error('Failed to extract OTP from email')
		}
		const otp = otpMatch[1]

		/**
		 * OTP Assertion 🧪
		 */

		expect(otp).toBeDefined()

		/**
		 * Verify the User with the OTP 🔐 ✅
		 */

		const verifyAccontResponse = await request(testApp)
			.post('/webapi/user/verify-account')
			.send({
				email: email,
				otp: otp,
			})

		/**
		 * Verify User Assertions 🧪
		 */

		expect(verifyAccontResponse.status).toEqual(200)

		/**
		 * Sign In the User 👨‍💻
		 */

		const response = await request(testApp).post('/webapi/user/signin').send({
			email: email,
			password: 'Test1234!',
		})

		/**
		 * Sign In User Assertions 👨‍💻🧪
		 */

		expect(response.status).toEqual(200)
		expect(response.body).toHaveProperty('AccessToken')
		expect(response.body).toHaveProperty('RefreshToken')
		expect(response.body).toHaveProperty('IdToken')
		expect(response.body).toHaveProperty('cognitoId')
		expect(response.body).toHaveProperty('userId')

		/**
		 * Refresh the Token 🔄
		 */

		const refreshTokenResponse = await request(testApp)
			.post('/webapi/user/refresh-token')
			.send({
				refreshToken: response.body.RefreshToken,
				cognitoId: response.body.cognitoId,
			})

		/**
		 * Refresh Token Assertions 🧪
		 */

		expect(refreshTokenResponse.status).toEqual(200)
		expect(refreshTokenResponse.body).toHaveProperty('AccessToken')

		/**
		 * ACCESS PROTECTED ROUTE 🛡
		 */

		const protectedResponse = await request(testApp)
			.get('/protected')
			.set('Authorization', `Bearer ${response.body.AccessToken}`)

		expect(protectedResponse.status).toEqual(200)

		/**
		 * Forgot Password 🤔💬
		 */

		const forgotPasswordResponse = await request(testApp)
			.post('/webapi/user/forgot-password')
			.send({
				email: email,
			})

		/**
		 * Forgot Password Assertions 🧪
		 */

		expect(forgotPasswordResponse.status).toEqual(200)
		expect(forgotPasswordResponse.body).toHaveProperty('CodeDeliveryDetails')

		/**
		 * Reset Password 🔄🔐
		 */

		// Fetch the last email
		const recoveryEmailData = await lastEmail(email, password)

		if (!recoveryEmailData) {
			throw new Error('No email found')
		}

		const codeMatch = /Your password reset code is (\d+)/.exec(
			<string>recoveryEmailData.html!
		)
		if (!codeMatch) {
			throw new Error('Failed to extract code from email')
		}

		const code = codeMatch[1]

		const resetPasswordResponse = await request(testApp)
			.post('/webapi/user/reset-password')
			.send({
				email: email,
				newPassword: 'Test4567!',
				code: code,
			})

		/**
		 * Reset Password Assertions 🧪
		 */

		expect(resetPasswordResponse.status).toEqual(200)

		/**
		 * Sign In with the new password 🔐 ✅
		 */

		const signInWithNewPasswordResponse = await request(testApp)
			.post('/webapi/user/signin')
			.send({
				email: email,
				password: 'Test4567!',
			})
			.expect(200)

		/**
		 * Sign Out ✌️
		 */

		const signOutResponse = await request(testApp)
			.post('/webapi/user/signout')
			.send({
				AccessToken: signInWithNewPasswordResponse.body.AccessToken,
			})

		/**
		 * Sign Out Assertions ✌️ 🧪
		 */

		expect(signOutResponse.status).toEqual(200)
	})
})
