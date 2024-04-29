# Template - Notes and Constraints

## Create Template

```curl
POST v1.1/apps/{{appId}}/integrations/{{integrationId}}/messageTemplates
```

```
category (possible values below):

"ACCOUNT_UPDATE"
"PAYMENT_UPDATE"
"PERSONAL_FINANCE_UPDATE"
"SHIPPING_UPDATE"
"RESERVATION_UPDATE"
"ISSUE_RESOLUTION"
"APPOINTMENT_UPDATE"
"TRANSPORTATION_UPDATE"
"TICKET_UPDATE"
"ALERT_UPDATE"
"AUTO_REPLY"
"OTP"
"MARKETING"
"AUTHENTICATION"
"UTILITY"

```

```
name
 1. requests must have a unique name / language pair
 2. name can only contain `lowercase` and `underscore` characters
```

```
langauge - can have multiple languages set for a template
```

```
components - see details below
```

[Faceboook Message Template Docs](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates)

## Component Notes

> [Smooch Message Template Docs](https://docs.smooch.io/rest/v1/#message-template-components)

```
format - optional
```

> The format of the HEADER component. Must be one of the following: TEXT, IMAGE, DOCUMENT. Required only if the component’s type is HEADER.

## Other Notes

- The message template name field is limited to 512 characters.
- The message template text field is limited to 1024 characters (BODY) and 60 characters (HEADER / FOOTER).
- A template can not be updated. We recommend using a test account when learning how to create templates.
- A WhatsApp Business Account can only create 100 message templates per hour.
- WhatsApp Business Account can have up to 250 message templates. That means 250 message template names, each of them can have multiple language translations. For example, a message template called hello_world translated into two languages counts as a single message template in regards to this limit.

## Notes on Deletion

> Deleting a template will delete all translations with that template name. Approved templates that are deleted will continue to work for a grace period of roughly 30 days.
> However, this also means that once a message template is deleted, that template name can not be re-used for 30 days.

## Tag Structure

```
head: [
    {
        index: number;
        type: string;
        value?: string;
        url?: string;
        prompt?: string;
        fields?: string[]; //used for csv fields or subscriber fields depending on type
    }
];
body: [
    {
        index: number;
        type: string;
        value?: string;
        url?: string;
        prompt?: string;
        fields?: string[]; //used for csv fields or subscriber fields depending on type
    }
];
```

## Notes on Tag Types

> Tags can be created for the for HEAD or BODY content types

- _index should start at 1 and increment up_

- _index of tag should match the order that you want to populate replacement tags for the HEAD / BODY_

| Option               | Description                                                | Notes                                                                                                                                            |
| -------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| csv                  | CSV Merge file uploaded to s3 and url saved against record | populate `fields` with the desired field + populate `url` with the `key` returned by `{apiURL}/api/templates/upload`                             |
| hard-coded           | Hard Coded value (setup at on template creation)           | populate `value` field with string value                                                                                                         |
| on-campaign-creation | On Campaign Creation                                       | populate the 'value' with the text you would like to use when passing the tags object on campaign creation                                       |
| image                | Image uploaded to s3 and url saved against record          | populate `url` field with the `location` returned by `{apiURL}/api/templates/upload`                                                             |
| subscriber-field     | Subscriber field to use for tag replacement                | populate `fields` with the subscriber field you want to replace - currently available fields are as follows: `mobileNumber, firstName, lastName` |
|                      |                                                            |                                                                                                                                                  |

## Tag Fields

| Field  | Description                                                                          | Notes                                                                                                                                                                                                                  |
| ------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| index  | Indexed used to populate replacement tags in template                                | Head and body                                                                                                                                                                                                          |
| type   | Type of Tag (see above)                                                              | The head tags cannot be populated with a csv                                                                                                                                                                           |
| value  | Used to store the value for 'hard-coded/on-campaign-creation' fields                 |                                                                                                                                                                                                                        |
| url    | Used to specify the url for tag types ( csv \| image)                                | The following endpoint should be used to upload any files required by templates: `{{url}}/api/templates/upload` This endpoint returns a tist of the uploaded files along with their public url which must be specified |
| prompt | Used to populate the prompt when assigining a value to this tag on campaign creation |                                                                                                                                                                                                                        |
| fields | Array of fields to be used for tag replacement                                       | Used for csv/subscriber fields                                                                                                                                                                                         |

## Notes on uploads

> Files uploads for templates are be be done via the following endpoint: \
>  `{{url}}/api/templates/upload`

> Files are to be send in a multipart/form-data \*this form can contain any keys (e.g file, image2 ) / number of files stored against these keys `(1-n files)`. This means that all files required by a template can be uploaded in a single request and referenced via the returned `"location"` field in the returned objects which can be used for the `"url"` field in tag creation.

> The s3 details used for the upload function are populated via the\
> `infra/k8s/template-depl.yaml` \
> `AWS_ACCESS_KEY_ID ` and `AWS_SECRET_ACCESS_KEY `
