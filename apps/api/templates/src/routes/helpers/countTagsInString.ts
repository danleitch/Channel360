export const countTagsInString = (text: string): number => {
	const tagRegEx = /{{(\d+)}}/g
	const matches = text?.match(tagRegEx)
	return matches ? matches.length : 0
}
