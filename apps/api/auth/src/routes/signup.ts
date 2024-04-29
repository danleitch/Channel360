import express, { Request, Response } from 'express'

import { validateRequest } from '@channel360/core'

import { SIGNUP_VALIDATION } from '@validations/auth-validation'
import { UserSignUpController } from '@controllers/UserSignUpController'

const router = express.Router()

router.post(
	'/webapi/user/signup',
	SIGNUP_VALIDATION,
	validateRequest,
	async (req: Request, res: Response) => {
		const controller = new UserSignUpController(req.body)
		try {
			const result = await controller.signUp()
			res.status(200).send(result)
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
)

export { router as V1_SignupRouter }
