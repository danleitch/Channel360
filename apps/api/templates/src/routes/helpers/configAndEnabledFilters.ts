import { TemplatesDoc } from '@models/templates'
import { returnConfiguredTemplates } from './templateFilter'

export class ConfigFilter {
	filter(templates: TemplatesDoc[]): TemplatesDoc[] {
		return templates.filter(returnConfiguredTemplates)
	}
}
