import { CognitoAPIProvider } from "@channel360/core";
export class UserSignOutController extends CognitoAPIProvider {
	constructor(private accessToken: string) {
		super()
	}

	PARAMS = {
		AccessToken: this.accessToken,
	}

	/**
	 * @method signOut
	 * @description - Sign out user from all devices
	 */
	public async signOut(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.cognitoIdentityServiceProvider.globalSignOut(
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
