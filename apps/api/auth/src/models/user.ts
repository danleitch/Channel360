import mongoose from 'mongoose'
import { Password } from '@channel360/core'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface UserAttrs {
	firstName: string
	lastName: string
	mobileNumber: string
	email: string
	password: string
	cognitoId?: string
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc

	findByEvent(event: { id: string; version: number }): Promise<UserDoc | null>
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
	firstName: string
	lastName: string
	mobileNumber: string
	email: string
	password: string
	cognitoId?: string
	version: number
}

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		mobileNumber: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			index: true,
		},
		cognitoId: {
			type: String,
			required: false,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform(_, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.password
				delete ret.__v
			},
		},
	}
)
userSchema.set('versionKey', 'version')
userSchema.plugin(updateIfCurrentPlugin)
userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'))
		this.set('password', hashed)
	}
	done()
})

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs)
}
userSchema.statics.findByEvent = (event: { id: string; version: number }) => {
	return User.findOne({
		_id: event.id,
		version: event.version - 1,
	})
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User, UserAttrs, UserDoc }
