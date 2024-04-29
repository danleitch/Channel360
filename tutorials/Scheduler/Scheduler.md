To access the Agenda Scheduler dashboard go to the following URL:

(Prod Scheduler Dash)[https://channel360.co.za/api/scheduler/dash/]

for dev environemnts this will be as follows: `{{url}}/api/scheduler/dash`

You can manually `create jobs` or `requeue` existing here

In order to create a manual job the name will need to be `send campaign` and you will need to populate all the information required for the even. Example below:

```
{
  "id": "6321ba467211b900194a772b",
  "organization": "CMTest",
  "reference": "Test Campaign1",
  "template": "63203934ff642f001ac43c68",
  "status": "enabled",
  "creator": "632030674ae80d001a9312cd",
  "scheduled": "2022-09-14T11:27:00.000Z",
  "subscriberGroup": "6320320bb1c372001aa41fd8",
  "tags": {
    "head": [],
    "body": []
  },
  "version": 0
}
```

When requeueing a job it will trigger a `SendCampaignEvent` immediately which is handled by the `SendCampaignListener` in the Campaign service.
