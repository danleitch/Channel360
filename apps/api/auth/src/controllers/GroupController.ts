import { CognitoAPIProvider } from '@channel360/core'

export class GroupController extends CognitoAPIProvider {
	constructor(private cognitoId: string, private groupName: string) {
		super()
	}

	PARAMS = {
		UserPoolId: process.env['AWS_COGNITO_POOL_ID']!,
		Username: this.cognitoId,
		GroupName: this.groupName,
	}

	public async assignUserToGroup(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.cognitoIdentityServiceProvider.adminAddUserToGroup(
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
