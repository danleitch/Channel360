import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import { currentAdmin, currentUser, errorHandler, NotFoundError } from "@channel360/core";
import { V1_GroupRouter } from "@routes/group";
import { V1_SignupRouter } from "@routes/signup";
import { V1_VerifyAccountRouter } from "@routes/verify-account";
import { V1_SigninRouter } from "@routes/signin";
import { V1_SignOutRouter } from "@routes/signout";
import { V1_RefreshTokenRouter } from "@routes/refresh-token";
import { V1_PasswordRecoveryRouter } from "@routes/password-recovery";
import { V1_ResendVerificationRouter } from "@routes/resend-verification";
import { signinRouter } from "@routes/api/sign-in";
import { currentUserRouter } from "@routes/api/current-user";
import { currentAdminRouter } from "@routes/api/admin/current-admin";
import { adminSigninRouter } from "@routes/legacy/admin/sign-in";
import { userRouter } from "@routes/legacy/admin/users";

const app = express()

app.use(Sentry.Handlers.requestHandler())

app.use(Sentry.Handlers.tracingHandler())

app.use(Sentry.Handlers.errorHandler())
app.use(cors({ origin: true, credentials: true }))
app.use(json())

app.use(signinRouter);
app.use(currentUser)
app.use(currentAdmin)
app.use(currentUserRouter)
app.use(currentAdminRouter)

app.use(adminSigninRouter)
app.use(userRouter)
// V1.1
app.use(V1_GroupRouter)
app.use(V1_SignupRouter)
app.use(V1_VerifyAccountRouter)
app.use(V1_SigninRouter)
app.use(V1_SignOutRouter)
app.use(V1_RefreshTokenRouter)
app.use(V1_PasswordRecoveryRouter)
app.use(V1_ResendVerificationRouter)

app.all('*', async () => {
	throw new NotFoundError()
})

app.use(errorHandler)

export { app }
