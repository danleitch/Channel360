import express, { Request, Response } from 'express'
import { BadRequestError, validateRequest } from '@channel360/core'
import {
	FORGOT_PASSWORD_VALIDATION,
	RESET_PASSWORD_VALIDATION,
} from '@validations/auth-validation'
import { ForgotPasswordController } from '@controllers/ForgotPasswordController'
import { ResetPasswordController } from '@controllers/ResetPasswordController'

const router = express.Router()

router.post(
	'/webapi/user/forgot-password',
	FORGOT_PASSWORD_VALIDATION,
	validateRequest,
	async (req: Request, res: Response) => {
		const { email } = req.body

		const controller = new ForgotPasswordController(email)
		try {
			const response = await controller.forgotPassword()
			res.status(200).send(response)
		} catch (error: any) {
			throw new BadRequestError(error.message)
		}
	}
)

router.post(
	'/webapi/user/reset-password',
	RESET_PASSWORD_VALIDATION,
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, code, newPassword } = req.body

		const controller = new ResetPasswordController(email, code, newPassword)
		try {
			const response = await controller.resetPassword()
			res.status(200).send(response)
		} catch (error: any) {
			throw new BadRequestError(error.message)
		}
	}
)

export { router as V1_PasswordRecoveryRouter }
