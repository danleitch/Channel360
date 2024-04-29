import { ParsedQs } from 'qs'

/**
 * @class SearchQueryManager
 * This is a factory class that constructs a search query 🔎
 * @param { string } orgId
 * @param { ParsedQs } queryParams
 */
export class SearchQueryManager {
	private orgId: string
	private queryParams: ParsedQs

	constructor(orgId: string, queryParams: ParsedQs) {
		this.orgId = orgId
		this.queryParams = queryParams
	}

	public constructQuery(): Query {
		const query: Query = {
			organization: this.orgId,
		}

		// Iterate over the queryParams and add them to the query object
		Object.keys(this.queryParams).forEach((key) => {
			switch (key) {
				case 'enabled':
					query.enabled = this.queryParams[key] === 'true'
					break
				// Add more cases as needed for additional query parameters
			}
		})

		return query
	}
}

interface Query {
	organization: string
	enabled?: boolean
	id?: string
}
