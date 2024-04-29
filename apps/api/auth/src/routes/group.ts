import express, { Request, Response } from 'express'
import {
	BadRequestError,
	ModelFinder,
	requireAdminGroup,
	validateCognitoToken,
	validateRequest,
} from '@channel360/core'
import { ASSIGN_USER_TO_GROUP_VALIDATION } from '@validations/auth-validation'
import { User } from '@models/user'
import { GroupController } from '@controllers/GroupController'

const router = express.Router()

router.post(
	'/webapi/user/:userId/group/:groupName',
	ASSIGN_USER_TO_GROUP_VALIDATION,
	validateRequest,
	validateCognitoToken,
	requireAdminGroup,
	async (req: Request, res: Response) => {
		// Get User Cognito Id.
		const user = await ModelFinder.findByIdOrFail(
			User,
			req.params.userId,
			'Could not find user'
		)

		const controller = new GroupController(
			user.cognitoId!,
			req.params.groupName
		)

		try {
			const result = await controller.assignUserToGroup()

			res.status(200).send(result)
		} catch (error: any) {
			throw new BadRequestError(error.message)
		}
	}
)

export { router as V1_GroupRouter }
