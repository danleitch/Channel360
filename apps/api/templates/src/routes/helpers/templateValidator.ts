import { TemplatesDoc } from 'src/models/templates'
import { Component, TemplateTag } from "@channel360/core";
import { countTagsInString } from './countTagsInString'

export abstract class TemplateValidator {
	protected template: TemplatesDoc
	constructor(template: TemplatesDoc) {
		this.template = template
	}
	abstract validate(): boolean
}

export abstract class TemplateHeadValidator extends TemplateValidator {
	headTag: TemplateTag | undefined

	headComponentFormat: 'TEXT' | 'IMAGE' | 'DOCUMENT' | "VIDEO" | undefined

	headTagCount: number
	constructor(template: TemplatesDoc) {
		super(template)

		this.headTag = template.tags?.head?.[0];

		this.headComponentFormat = template.components[0]?.format

		const headComponent = template.components?.find(
			(component: Component) => component.type === 'HEADER'
		)

		this.headTagCount = countTagsInString(headComponent?.text || '')
	}
}
