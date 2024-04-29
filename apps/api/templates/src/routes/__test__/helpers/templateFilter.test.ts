import { countTagsInString } from '../../helpers/countTagsInString' // Replace with the actual path to your TypeScript file

describe('countTagsInString', () => {
	it('should count the number of tags in the input string', () => {
		const inputString = 'This is a {{1}} sample {{2}} string {{3}}.'
		const tagCount = countTagsInString(inputString)

		// Ensure that the tag count matches the expected count
		expect(tagCount).toBe(3)
	})

	it('should return 0 for a string with no tags', () => {
		const inputString = 'This is a sample string without tags.'
		const tagCount = countTagsInString(inputString)

		// Ensure that there are no tags in the string
		expect(tagCount).toBe(0)
	})
})
