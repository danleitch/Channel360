import { CognitoAPIProvider } from "@channel360/core";

export class ForgotPasswordController extends CognitoAPIProvider {
	constructor(private email: string) {
		super(email)
	}

	PARAMS = {
		ClientId: process.env['AWS_COGNITO_CLIENT_ID']!,
		Username: this.email,
		SecretHash: this.SECRET_HASH,
	}

	public async forgotPassword(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.cognitoIdentityServiceProvider.forgotPassword(
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
