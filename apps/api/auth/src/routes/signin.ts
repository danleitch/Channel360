import express, { Request, Response } from 'express'
import { BadRequestError, ModelFinder, validateRequest } from '@channel360/core'
import { SIGNIN_VALIDATION } from '@validations/auth-validation'
import { UserSignInController } from '@controllers/UserSignInController'
import { User } from '@models/user'
import jwt from 'jsonwebtoken'
import { UserUpdatedPublisher } from '@publishers/user-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
	'/webapi/user/signin',
	SIGNIN_VALIDATION,
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			const user = await ModelFinder.findOneOrFail(
				User,
				{ email: req.body.email },
				'Could not find user'
			)

			const controller = new UserSignInController(
                req.body.email,
                req.body.password
            )


			const result = await controller.signIn()


			if (!user.cognitoId && result.IdToken) {
				try {
					const decodedToken = jwt.decode(result.IdToken)
					if (
						decodedToken &&
						typeof decodedToken === 'object' &&
						'sub' in decodedToken
					) {
						user.cognitoId = decodedToken.sub
						await user.save()

						await new UserUpdatedPublisher(natsWrapper.client).publish({
							id: user.id,
							email: user.email,
							firstName: user.firstName,
							lastName: user.lastName,
							mobileNumber: user.mobileNumber,
							cognitoId: decodedToken.sub!,
							version: user.version,
						})
					}
				} catch (err) {
					console.error('Error decoding token:', err)
					throw new BadRequestError('Error decoding token')
				}
			}

			res
				.status(200)
				.send({ ...result, userId: user.id, cognitoId: user.cognitoId })
		} catch (error: any) {
			throw new BadRequestError(error.message)
		}
	}
)

export { router as V1_SigninRouter }
