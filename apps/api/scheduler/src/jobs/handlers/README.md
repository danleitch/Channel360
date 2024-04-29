# Handlers

The `JobHandlers` module contains handler functions for processing jobs scheduled by the **Agenda** job scheduling library. These handlers perform specific tasks related to sending campaigns and synchronizing templates. The module uses the **NATS messaging system** and corresponding publishers to communicate and publish events.

## Overview

The `JobHandlers` module exports two handler functions: `sendCampaign` and `syncTemplates`. These handlers are associated with specific job types defined in the Agenda scheduler.

## Usage

The `JobHandlers` module is typically utilized within the context of the `templateDefinitions` and `campaignDefinitions` modules, where jobs are defined using the Agenda library.

## Dependencies

This module assumes the existence of the `natsWrapper` module, which provides access to the NATS messaging system. Additionally, it relies on two publishers: `CampaignSendPublisher` and `SyncTemplatesPublisher`. Ensure that these publishers are correctly implemented and available in your project.

## Handler: `sendCampaign`

The `sendCampaign` handler processes the "send campaign" job. It publishes a `CampaignSendEvent` using the `CampaignSendPublisher` to notify other parts of the system that a campaign should be sent.

## Handler: `syncTemplates`

The `syncTemplates` handler processes the "sync templates" job. It publishes a `TemplateSyncEvent` using the `SyncTemplatesPublisher` to trigger the synchronization of templates.

## Contributing

Contributions to enhance and improve the `JobHandlers` module are welcome. Feel free to create issues or submit pull requests.