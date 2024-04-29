import { CognitoAPIProvider } from '@channel360/core'

export class UserResendVerificationController extends CognitoAPIProvider {
	constructor(private email: string) {
		super(email)
	}

	PARAMS = {
		UserPoolId: process.env['AWS_COGNITO_USER_POOL_ID']!,
		ClientId: process.env['AWS_COGNITO_CLIENT_ID']!,
		Username: this.email,
		SecretHash: this.SECRET_HASH,
	}

	/**
	 * @method resendOTP
	 * @description - Resend OTP
	 */
	public async resendOTP(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.cognitoIdentityServiceProvider.resendConfirmationCode(
				this.PARAMS,
				(err, data) => {
					if (err) {
						reject(err)
					} else {
						resolve(data)
					}
				}
			)
		})
	}
}
