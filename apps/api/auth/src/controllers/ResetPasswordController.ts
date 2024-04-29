import { CognitoAPIProvider } from "@channel360/core";
export class ResetPasswordController extends CognitoAPIProvider {
	constructor(
		private email: string,
		private code: string,
		private newPassword: string
	) {
		super(email)
	}

	PARAMS = {
		ClientId: process.env['AWS_COGNITO_CLIENT_ID']!,
		Username: this.email,
		ConfirmationCode: this.code,
		Password: this.newPassword,
		SecretHash: this.SECRET_HASH,
	}

	public async resetPassword(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.cognitoIdentityServiceProvider.confirmForgotPassword(
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
