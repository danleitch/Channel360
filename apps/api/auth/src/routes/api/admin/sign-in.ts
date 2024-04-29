import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { BadRequestError, Password, validateRequest } from "@channel360/core";
import { Admin } from '@models/admin';

interface AdminPayload {
  id: string
  email: string
}

const router = express.Router()

router.post(
  '/api/admin/signin',
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

    const existingAdmin = await Admin.findOne({ email })
    if (!existingAdmin) {
      throw new BadRequestError('Invalid credentials')
    }

    const passwordsMatch = await Password.compare(
      existingAdmin.password,
      password
    )
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials')
    }

    if (!process.env.ADMIN_JWT_KEY) {
      throw new Error('ADMIN_JWT_KEY must be defined')
    }

    // Generate JWT
    const adminJwt = jwt.sign(
      {
        id: existingAdmin.id,
        email: existingAdmin.email,
      } as AdminPayload,
      process.env.ADMIN_JWT_KEY
    )

    // Store it on session object
    req.session = {
      jwt: adminJwt,
    }
    req.session.save()
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    res.status(200).send({ user: existingAdmin, token: adminJwt })
  }
)

export { router as adminSigninRouter }