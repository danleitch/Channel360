import express, { Request, Response } from 'express'
import { BadRequestError, validateRequest } from '@channel360/core'
import { REFRESH_TOKEN_VALIDATION } from '@validations/auth-validation'
import { RefreshTokenController } from '@controllers/RefreshTokenController'

const router = express.Router()

router.post(
	'/webapi/user/refresh-token',
	REFRESH_TOKEN_VALIDATION,
	validateRequest,
	async (req: Request, res: Response) => {
		const { cognitoId, refreshToken } = req.body

		const controller = new RefreshTokenController(cognitoId, refreshToken)
		try {
			const response = await controller.requestRefreshToken()
			res.status(200).send(response)
		} catch (error: any) {
			throw new BadRequestError(error.message)
		}
	}
)

export { router as V1_RefreshTokenRouter }
