import { CognitoAPIProvider } from "@channel360/core";
export class VerifyAccountController extends CognitoAPIProvider {
	constructor(private email: string, private otp: string) {
		super(email)
	}

	PARAMS = {
		ClientId: process.env['AWS_COGNITO_CLIENT_ID']!,
		Username: this.email,
		ConfirmationCode: this.otp,
		SecretHash: this.SECRET_HASH,
	}

	public async verifyAccount(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.cognitoIdentityServiceProvider.confirmSignUp(
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
