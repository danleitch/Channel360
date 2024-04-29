import { Templates } from '@models/templates'

// Template creation function.
export const createTemplate = async (name: string, orgId: string) => {
	return Templates.build({
		tags: {
			head: [
				{
					index: 1,
					type: 'hard-coded',
					value: 'TAG',
				},
			],
			body: [
				{
					index: 1,
					type: 'hard-coded',
					value: 'TAG',
				},
				{
					index: 2,
					type: 'hard-coded',
					value: 'TAG',
				},
			],
		},
		organization: orgId,
		name,
		description: `${name} description for a ${name.toLowerCase()} template`,
		namespace: `${name}Namespace`,
		language: 'en-US',
		category: 'MARKETING',
		status:"APPROVED",
		enabled:true,
		components: [
			{
				type: 'HEADER',
				format: 'TEXT',
				text: `${name.toUpperCase()} ALERT!! {{1}}`,
			},
			{
				type: 'BODY',
				text: `This is a ${name.toLowerCase()} template with no merge tags and CTA Button to our Staging Environment. `,
			},
			{
				type: 'FOOTER',
				text: `(C) ${name} Team. Stop to optout. `,
			},
		],
	})
}
