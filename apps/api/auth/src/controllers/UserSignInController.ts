import { CognitoAPIProvider } from "@channel360/core";
export class UserSignInController extends CognitoAPIProvider {
	constructor(private email: string, private password: string) {
		super(email)
	}

	PARAMS = {
		AuthFlow: 'USER_PASSWORD_AUTH',
		ClientId: process.env['AWS_COGNITO_CLIENT_ID']!,
		AuthParameters: {
			USERNAME: this.email,
			PASSWORD: this.password,
			SECRET_HASH: this.SECRET_HASH,
		},
	}

	public async signIn(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.cognitoIdentityServiceProvider.initiateAuth(
				this.PARAMS,
				(err, data) => {
					if (err) {
						reject(err)
					} else {
						resolve(data.AuthenticationResult)
					}
				}
			)
		})
	}
}
