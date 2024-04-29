import { User, UserDoc } from '@models/user'
import { CognitoAPIProvider } from '@channel360/core'
import { UserCreatedPublisher } from '@publishers/user-created-publisher'
import { natsWrapper } from '../nats-wrapper'

export class UserSignUpController extends CognitoAPIProvider {
	constructor(public user: UserDoc) {
		super(user.email)
	}

	PARAMS = {
		ClientId: process.env['AWS_COGNITO_CLIENT_ID']!,
		Username: this.user.email,
		Password: this.user.password,
		UserAttributes: [
			{
				Name: 'email',
				Value: this.user.email,
			},
			{
				Name: 'given_name',
				Value: this.user.firstName,
			},
			{
				Name: 'family_name',
				Value: this.user.lastName,
			},
			{
				Name: 'phone_number',
				Value: this.user.mobileNumber,
			},
		],
		SecretHash: this.SECRET_HASH,
	}

	public async signUp(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.cognitoIdentityServiceProvider.signUp(
				this.PARAMS,
				async (err, data) => {
					if (err) {
						reject(err)
					} else {
						// Build User Object
						const user = User.build({
							...this.user,
							cognitoId: data.UserSub,
						})
						// Save User to DB
						await user.save()
						// Emit UserCreatedEvent.
						await new UserCreatedPublisher(natsWrapper.client).publish({
							id: user.id,
							firstName: user.firstName,
							lastName: user.lastName,
							email: user.email,
							mobileNumber: user.mobileNumber,
							cognitoId: data.UserSub,
						})
						resolve(data)
					}
				}
			)
		})
	}
}
