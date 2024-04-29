# Subscriber Report 

This API endpoint generates a report on subscriber statistics within a specified date range for a given organization.

## Usage

1. **Request:**
   - Make a POST request to the **Subscriber Report** endpoint, where `:orgId` is the ID of the organization.

2. **Request Body:**
   - The request body should contain the date range for the report in the format:
     ```json
     {
       "startDate": "YYYY-MM-DDTHH:mm:ss.sssZ",
       "endDate": "YYYY-MM-DDTHH:mm:ss.sssZ"
     }
     ```
     where `startDate` is the start date and `endDate` is the end date.

3. **Response:**
   - Successful requests will return a 200 status code with the generated subscriber report.

## Request Parameters

- `orgId`: The ID of the organization for which the report is generated.

## Request Body

Provide a JSON object with the following fields:

- `startDate`: The start date of the date range in ISO format (e.g., "2023-01-01T00:00:00.000Z").
- `endDate`: The end date of the date range in ISO format.

```json
{
  "startDate": "2023-01-01T00:00:00.000Z",
  "endDate": "2023-12-31T23:59:59.999Z"
}
```

## Response

Successful responses (status code 200) will have a JSON response body containing the generated subscriber report.

## Error Handling

- If the specified organization by `orgId` is not found, the API will return a 400 status code with the message "Organization not found."