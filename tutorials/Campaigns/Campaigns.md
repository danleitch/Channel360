# Campaigns - Notes and Constraints

## Create Campaign

```
reference: string
```

> references must be unique as they will be used to name the job associated to them if any updates or changes are required (update/stop job)

```
status: string
```

> Campaigns will ONLY be scheduled for sending if a status of `'enabled'` is passed for this parameter otherwise the campaign will not be scheduled for sending by the job scheduler

```
tags?: Tag
```

> See Template for more details on how tags work

> **All Tags** for the template must be provided when creating a campaign (template tag object can be reused and populated where needed)

> If the campaign uses a template that contains any tags that need to be provided `'on-campaign-creation'` then the `value` field for these tags **must be set** in the create campaign request. If not all tags are provided the endpoint will return an error specify if the missing tag is from the header or footer tags.

```
recipients
```

> \*placeholder to be updated based on return events

## Update Campaign

> Needs to update the job related to the campaign

## Delete Campaign

> Needs to delete the job related to the campaign

## Notes - Linking users back to campaigns

### Webhooks

### Send Notification Response

```
{
    "notification": {
        "_id": "e361392f-7dd3-4bdb-8844-d0d002ac7f72"
    }
}
```

> In response, a `notification id` is generated to track the notification during the delivery process. See the webhook section on how to track the delivery of a notification. This id is not persisted and is valid until the notification is delivered.

> This notification_id should be stored against the recipients attribute for the campaign - this will be used to update delivery status of the notification. On successful notification a matchResult.appUser object is returned which will be used to update the subscribers model (add their conversation ID which can be used for the lookup of conversations had by the subscriber against a given (appId, conversationId))

## Available Webhooks

```
notification:delivery:channel
notification:delivery:failure
notification:delivery:user
```

> On successful delivery Webhook body contains a matchresult.appUser \
> \
>  An object representing the appUser and conversation associated with the notification.

```
"matchResult": {
    "appUser": {
        "_id": "5b354bdab42a1d61143ccc26",
        "userId": "bob@email.com",
        "conversationStarted": true
    }
}
```

> Once this webhook has been used to update the
