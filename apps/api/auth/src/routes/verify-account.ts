import express, { Request, Response } from 'express'
import { BadRequestError, validateRequest } from '@channel360/core'
import { VERIFY_ACCOUNT_VALIDATION } from '@validations/auth-validation'
import { VerifyAccountController } from '@controllers/VerifyAccountController'

const router = express.Router()

router.post(
	'/webapi/user/verify-account',
	VERIFY_ACCOUNT_VALIDATION,
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, otp } = req.body
		const controller = new VerifyAccountController(email, otp)

		try {
			const result = await controller.verifyAccount()
			res.status(200).send(result)
		} catch (error: any) {
			throw new BadRequestError(error.message)
		}
	}
)

export { router as V1_VerifyAccountRouter }
