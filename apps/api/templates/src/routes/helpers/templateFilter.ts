import { TemplatesDoc } from '@models/templates'
import { Component } from '@channel360/core'
import { countTagsInString } from './countTagsInString'
import { TemplateHeadValidator, TemplateValidator } from './templateValidator'

class ImageTagValidator extends TemplateHeadValidator {
	validate(): boolean {
		// If the HeaderFormat is Image, then the Head Tag must be type image
		if (this.headComponentFormat === 'IMAGE') {
			return this.headTag?.type === 'image'
		}

		return true
	}
}

class HeadCountShouldNotBeMoreThanOne extends TemplateHeadValidator {
	validate(): boolean {
		if (
			this.template &&
			this.template.tags &&
			Array.isArray(this.template.tags.head)
		) {
			return this.template.tags.head.length <= 1
		}

		return true
	}
}

class TextTagValidator extends TemplateHeadValidator {
	validate(): boolean {
		// If the HeaderFormat is Text, then the Head Tag must not be type image or document
		if (this.headComponentFormat === 'TEXT') {
			return this.headTag?.type !== 'image' && this.headTag?.type !== 'document'
		}

		return true
	}
}

class DocumentTagValidator extends TemplateHeadValidator {
	validate(): boolean {
		// If the HeaderFormat is Text, then the Head Tag must not be type image or document
		if (this.headComponentFormat === 'DOCUMENT') {
			return (
				this.headTag?.type === 'document' || this.headTag?.type === undefined
			)
		}

		return true
	}
}

class BodyTagValidator extends TemplateValidator {
	validate(): boolean {
		const bodyComponent = this.template.components?.find(
			(component: Component) => component.type === 'BODY'
		)

		const requiredTagsCount = bodyComponent
			? countTagsInString(bodyComponent.text!)
			: 0
		const numberOfTagsInBody = this.template.tags?.body?.length || 0

		// Check if the body meets the required tags
		return numberOfTagsInBody === requiredTagsCount
	}
}

class ButtonsTagValidator extends TemplateValidator {
	validate(): boolean {
		const buttonsComponent = this.template.components?.find(
			(component: Component) => component.type === 'BUTTONS'
		)

        const expectedButtonCount = buttonsComponent?.buttons!.length || 0;
        const actualButtonCount = this.template.tags?.buttons?.length || 0;

        return actualButtonCount === expectedButtonCount;
	}
}

class StatusApprovedValidator extends TemplateValidator {
	validate(): boolean {
		return this.template.status === 'APPROVED'
	}
}

const validateTemplate = (template: TemplatesDoc) => {
	const validators = [
		new ImageTagValidator(template),
		new TextTagValidator(template),
		new DocumentTagValidator(template),
		new HeadCountShouldNotBeMoreThanOne(template),
		new BodyTagValidator(template),
		new StatusApprovedValidator(template),
		new ButtonsTagValidator(template),
	]

	return validators.every((validator) => validator.validate())
}

const returnConfiguredTemplates = (template: TemplatesDoc) =>
	validateTemplate(template)

export { returnConfiguredTemplates }
