#   Admin Metrics 
The `notificationsAdminReportRouter` is an Express router designed to provide information on the number of notifications created each hour over the past 24 hours. It uses the MongoDB Aggregation Framework to aggregate data from the `Notification` model.

## Functionality
- ### Get Notifications by Hour for the Past 24 Hours

Description: Retrieve the count of notifications created each hour over the past 24 hours.

## Response
The response is an object containing the count of notifications for each hour: 

##  Usage
This endpoint provides insights into the distribution of notifications throughout the day.
Integrate this router into your application to obtain valuable information about the usage patterns of your notification system.
Feel free to incorporate this functionality into your project for monitoring and analysis purposes.

<hr style="border: 0.05px solid blue;">

# Notifications

The `notificationsReportRouter` is an Express router designed to retrieve notification metrics from campaigns based on specified parameters. It provides information on the count of notifications for different statuses such as "PENDING," "DELIVERED TO CHANNEL," "DELIVERED," "READ," and "FAILED."

## Request Parameters
- __orgId (URL Parameter):__ The organization ID.
__Body Parameters:__
`startDate` (Date): Start date for the query.
`endDate` (Date): End date for the query.
`status` (String): Status of the notifications. Must be provided and cannot be empty.
`campaignId` (String, optional): Campaign ID to filter notifications for a specific campaign.

## Middleware
The router uses middleware functions to validate the request and ensure that the required parameters are provided.

## Request Handler
The request handler retrieves notification metrics based on the specified parameters. It handles both cases when a specific campaign ID is provided (`campaignId`) and when querying notifications within a date range.

## Response
The response includes the count of notifications based on the specified status or a breakdown of counts for all statuses.

<hr style="border: 0.05px solid blue;">
