import { Component, Tag } from '@channel360/core'
import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

export interface TemplateAttrs {
	organization: string
	name: string
	description: string
	namespace: string
	language: string
	category: 'MARKETING' | 'AUTHENTICATION' | 'UTILITY'
	tags: Tag
	status: string
	enabled: boolean
	components: Component[]
	messageTemplateId: string
}

export interface TemplatesDoc extends mongoose.Document {
	organization: string
	name: string
	description: string
	namespace: string
	status: string
	language: string
	category: 'MARKETING' | 'AUTHENTICATION' | 'UTILITY'
	tags: Tag
	components: Component[]
	enabled: boolean
	messageTemplateId: string
	version: number;
}

interface TemplatesModel extends mongoose.Model<TemplatesDoc> {
	build(attrs: TemplateAttrs): TemplatesDoc
}

const templatesSchema = new mongoose.Schema(
	{
		//Channel360 Fields
		organization: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		namespace: {
			type: String,
		},
		status: {
			type: String,
			required: true,
		},
		enabled: {
			type: Boolean,
			required: true,
			default: true
		},

		//SMOOCH fields
		category: {
			type: String,
			enum: ['MARKETING', 'AUTHENTICATION', 'UTILITY'],
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},

		components: [
			{
				_id: false,
				type: {
					type: String,
					required: true,
					enum: ['HEADER', 'BODY', 'FOOTER', 'BUTTONS'],
				},
				format: {
					type: String,
					enum: ['TEXT', 'IMAGE', 'DOCUMENT'],
				},
				text: {
					type: String,
				},
				buttons: [
					{
						_id: false,
						type: {
							type: String,
							required: true,
							enum: ['QUICK_REPLY', 'PHONE_NUMBER', 'URL'],
						},
						phoneNumber: { type: String },
						url: { type: String },
						text: { type: String },
					},
				],
			},
		],
		tags: {
			head: [
				{
					_id: false,
					index: Number,
					type: { type: String },
					value: String,
					url: String,
					prompt: String,
					fields: String,
					document: {
						link: String,
						filename: String,
					},
				},
			],
			body: [
				{
					_id: false,
					index: Number,
					type: { type: String },
					value: String,
					url: String,
					prompt: String,
					fields: String,
					document: {
						link: String,
						filename: String,
					},
				},
			],
		},
		messageTemplateId: { type: String },
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
			},
		},
	}
)
templatesSchema.set('versionKey', 'version')
templatesSchema.plugin(updateIfCurrentPlugin)
templatesSchema.index({ name: 1, language: 1, organization: 1 })

templatesSchema.statics.build = (attrs: TemplateAttrs) => {
	return new Templates(attrs)
}

const Templates = mongoose.model<TemplatesDoc, TemplatesModel>(
	'Templates',
	templatesSchema
)

export { Templates }
