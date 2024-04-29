import { BadRequestError } from '@channel360/core'
import { TemplatesDoc } from '@models/templates'
import { returnConfiguredTemplates } from './templateFilter'

export class FilterManager {
	constructor(private templates: TemplatesDoc[]) {}

	public applyFilter(filter: string): TemplatesDoc[] {
		const filterMap: { [key: string]: () => TemplatesDoc[] } = {
			configured: () => this.templates.filter(returnConfiguredTemplates),
		}

		const filterFunction = filterMap[filter]

		if (!filterFunction) {
			throw new BadRequestError(
				'Invalid filter parameter provided. Accepted values are configured, unconfigured, imageNotValid, imageValid, etc.'
			)
		}

		return filterFunction()
	}
}
