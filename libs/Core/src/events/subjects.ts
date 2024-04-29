export enum Subjects {
    InviteCreated = "email:invite",
    ResetCreated = "email:reset",
    OTPCreated = "email:otp",
    UserAddedCreated = "email:user-added",
    EmailCreated = "email:created",

    UserCreated = "user:created",
    UserUpdated = "user:updated",

    AdminCreated = "admin:created",
    AdminUpdated = "admin:updated",

    OrganizationCreated = "organization:created",
    OrganizationUpdated = "organization:updated",

    PlanCreated = "plan:created",
    PlanUpdated = "plan:updated",

    SettingsCreated = "settings:created",
    SettingsUpdated = "settings:updated",

    ReplyCreated = "reply:created",

    SmoochAppCreated = "smoochApp:created",
    SmoochAppDeleted = "smoochApp:deleted",
    SmoochAppUpdated = "smoochApp:updated",

    SmoochAppTemplateCreated = "smoochAppTemplate:created",


    TemplateCreated = "template:created",
    TemplateSync = "template:sync",
    TemplateInternalUpdated = "templateInternal:updated",
    TemplateUpdated = "template:updated",
    TemplateDeleted = "template:deleted",
    TemplateIngested = "template:ingested",
    TemplateImported = "template:import",

    CampaignCreated = "campaign:created",
    CampaignUpdated = "campaign:updated",
    CampaignDeleted = "campaign:deleted",
    CampaignSend = "campaign:send",

    CampaignJobCreate = "campaignJob:created",
    CampaignJobUpdate = "campaignJob:updated",
    CampaignJobDeleted = "campaignJob:deleted",

    SubscriberCreated = "subscriber:created",
    SubscriberUpdated = "subscriber:updated",
    SubscriberDeleted = "subscriber:deleted",
    SubscriberImport = "subscriber:imported",
    SubscriberOpt = "subscriber:opt",

    SubscriberImported = "subscriber:imported",

    GroupCreated = "group:created",
    GroupUpdated = "group:updated",
    GroupDeleted = "group:deleted",

    SubscriberGroupAssign = "subscriberGroup:assign",
    SubscriberGroupUnassign = "subscriberGroup:unassign",

    NotificationCreated = "notification:created",
    NotificationSent = "notification:sent",
    NotificationDeliveryChannel = "notification:delivery",

    NotificationStatusCreated = "notificationStatus:created",

    MessageAppUser = "message:appUser",

    AppUserCreated = "appUser:created",

    APIKeyCreated = "apiKey:created",
    APIKeyUpdated = "apiKey:updated",

    CustomerResponseCreated = "customerResponse:created",
}
