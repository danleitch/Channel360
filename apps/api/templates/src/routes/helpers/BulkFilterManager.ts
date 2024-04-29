import { BadRequestError } from '@channel360/core'
import { TemplatesDoc } from '@models/templates'
import { ConfigFilter } from './configAndEnabledFilters'

export class BulkFilterManager {
	private templates: TemplatesDoc[]

	constructor(templates: TemplatesDoc[]) {
		this.templates = templates
	}

	public applyBulkFilter(filter: string, bulkIds: object[]): TemplatesDoc[] {
		const filterMap: Record<string, (template: TemplatesDoc) => boolean> = {
			configured: (template) =>
				new ConfigFilter().filter([template]).length > 0,
			// Add more filters as needed
		}

		const filterFunction = filterMap[filter]

		if (!filterFunction) {
			throw new BadRequestError('Invalid filter parameter provided.')
		}

		const filteredTemplates = this.templates.filter((template) => {
			// Check match filter
			const filterMatch = filterFunction(template)

			// Check if the template ID is in the bulkIds array
			const idMatch = bulkIds.includes(template.id)

			// Return only if when conditions are met
			return filterMatch && idMatch
		})

		return filteredTemplates
	}
}
