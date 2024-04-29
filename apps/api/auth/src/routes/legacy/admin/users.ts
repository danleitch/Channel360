import express, { Request, Response } from 'express'
import { User } from '@models/user'
import { requireAdminGroup, validateCognitoToken } from "@channel360/core";

const router = express.Router()

router.get('/webapi/admin/users', validateCognitoToken, requireAdminGroup, async (_req: Request, res: Response) => {
	const users = await User.find({})
	res.send(users)
})

export { router as userRouter }
