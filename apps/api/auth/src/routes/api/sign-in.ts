import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { User } from '@models/user'
import {
	BadRequestError,
	EmailSubjects,
	OTPGenerator,
	Password,
	validateRequest,
} from '@channel360/core'
import { Verification } from '@models/verification'
import { natsWrapper } from '../../nats-wrapper'
import { Otp } from '@models/otp'
import { EmailPublisher } from '@publishers/email-publisher'

const router = express.Router()

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.notEmpty()
			.withMessage('You must supply a password'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body
		const existingUser = await User.findOne({ email })
		if (!existingUser) {
			throw new BadRequestError('Invalid credentials')
		}

		const passwordsMatch = await Password.compare(
			existingUser.password,
			password
		)
		if (!passwordsMatch) {
			throw new BadRequestError('Invalid Credentials')
		}

		// Has the user been verified

		const verification = await Verification.findOne({ user: existingUser.id })

		if (!verification) {
			const otpGenerator = new OTPGenerator()

			const otp = await Otp.findOneAndUpdate(
				{ user: existingUser.id },
				{ otp: otpGenerator.generateOTP() },
				{ upsert: true, new: true }
			)

			await new EmailPublisher(natsWrapper.client).publish({
				emailType: EmailSubjects.OtpCreated,
				toEmail: existingUser.email,
				otp: otp!.otp,
				name: existingUser.firstName,
			})

			const path = `/auth/verify?userId=${existingUser.id}&email=${email}`

			res.status(302).send({ message: 'User is not verified', path })
		}
		// Generate JWT
		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.JWT_KEY!
		)

		res.setHeader(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept'
		)
		res.status(200).send({ user: existingUser, token: userJwt })
	}
)

export { router as signinRouter }
