import { body, param } from 'express-validator'

const mobileNumberValidator = body('mobileNumber')
	.isMobilePhone('any')
	.withMessage('Mobile Number must be valid')
	.custom((value) => {
		// Define the prefix or prefixes you want to check for
		const prefixes = ['+'] // Example prefixes
		const prefixMatch = prefixes.some((prefix) => value.startsWith(prefix))
		if (!prefixMatch) {
			// If the mobile number does not start with any of the specified prefixes, throw an error
			throw new Error('Mobile Number must start with a valid prefix')
		}
		// If the validation passes, return true
		return true
	})

export default mobileNumberValidator

export const SIGNUP_VALIDATION = [
	body('firstName')
		.isAlpha('en-US', { ignore: ' ' })
		.withMessage('First name must be valid'),
	body('lastName')
		.isAlpha('en-US', { ignore: ' ' })
		.withMessage('Last name must be valid'),
	mobileNumberValidator,
	body('email').isEmail().withMessage('Email must be valid'),
	body('password')
		.trim()
		.isLength({ min: 8, max: 20 })
		.withMessage('Password must be between 8 and 20 characters'),
]

export const SIGNIN_VALIDATION = [
	body('email').isEmail().withMessage('Email must be valid'),
	body('password').notEmpty().withMessage('Password must be provided'),
]
export const SIGNOUT_VALIDATION = [
	body('AccessToken').notEmpty().withMessage('AccessToken must be valid'),
]

export const VERIFY_ACCOUNT_VALIDATION = [
	body('email').isEmail().withMessage('Email must be valid'),
	body('otp').notEmpty().withMessage('OTP must be provided'),
]

export const RESEND_VERIFICATION_VALIDATION = [
	body('email').isEmail().withMessage('Email must be valid'),
]

export const REFRESH_TOKEN_VALIDATION = [
	body('cognitoId').notEmpty().withMessage('cognitoId must be valid'),
	body('refreshToken').notEmpty().withMessage('refreshToken must be valid'),
]

export const FORGOT_PASSWORD_VALIDATION = [
	body('email').isEmail().withMessage('Email must be valid'),
]

export const RESET_PASSWORD_VALIDATION = [
	body('email').isEmail().withMessage('Email must be valid'),
	body('code').notEmpty().withMessage('code must be valid'),
	body('newPassword').notEmpty().withMessage('newPassword must be valid'),
]

export const ASSIGN_USER_TO_GROUP_VALIDATION = [
	param('userId').notEmpty().withMessage('userId must be valid'),
	param('groupName').notEmpty().withMessage('groupName must be provided'),
]
