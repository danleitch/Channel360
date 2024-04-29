import { CognitoAPIProvider } from "@channel360/core";
export class RefreshTokenController extends CognitoAPIProvider {
	constructor(userId: string, private refreshToken: string) {
		super(userId)
	}

	PARAMS = {
		AuthFlow: 'REFRESH_TOKEN_AUTH',
		ClientId: process.env['AWS_COGNITO_CLIENT_ID']!,
		AuthParameters: {
			REFRESH_TOKEN: this.refreshToken,
			SECRET_HASH: this.SECRET_HASH,
		},
	}

	public async requestRefreshToken(): Promise<any> {
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
