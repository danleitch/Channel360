import express, { Request, Response } from 'express'
import { BadRequestError, validateRequest } from '@channel360/core'
import { SIGNOUT_VALIDATION } from '@validations/auth-validation'
import { UserSignOutController } from '@controllers/UserSignOutController'

const router = express.Router()

router.post(
	'/webapi/user/signout',
	SIGNOUT_VALIDATION,
	validateRequest,
	async (req: Request, res: Response) => {
		const controller = new UserSignOutController(req.body.AccessToken)

		try {
			const result = await controller.signOut()

			res.status(200).send(result)
		} catch (error: any) {
			throw new BadRequestError(error.message)
		}
	}
)

export { router as V1_SignOutRouter }
