import express, { Request, Response } from 'express'
import { BadRequestError, validateRequest } from "@channel360/core";
import { RESEND_VERIFICATION_VALIDATION } from '@validations/auth-validation'
import { UserResendVerificationController } from '@controllers/ResendOTPController'

const router = express.Router()

router.post(
	'/webapi/user/resend-otp',
	RESEND_VERIFICATION_VALIDATION,
	validateRequest,
	async (req: Request, res: Response) => {
		const controller = new UserResendVerificationController(req.body.email)

		try {
			const result = await controller.resendOTP()

			res.status(200).send(result)
		} catch (error: any) {
			throw new BadRequestError(error.message)
		}
	}
)

export { router as V1_ResendVerificationRouter }
