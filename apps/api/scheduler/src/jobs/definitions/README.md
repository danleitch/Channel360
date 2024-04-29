# Campaign 

The `campaignDefinitions` module is responsible for defining jobs related to campaign processing using the **Agenda** job scheduling library. It utilizes the `JobHandlers` module to specify the logic associated with each job.

## Overview

In a messaging or job queue system, such as Agenda, jobs represent discrete units of work that need to be performed asynchronously. The `campaignDefinitions` module defines a specific job named "send campaign" using the `define` method provided by the Agenda library.

## Usage

To use the `campaignDefinitions` module, pass an instance of Agenda and call the `define` method with the desired job name and associated handler function. Typically, this would be done when initializing your application or setting up your job scheduler.

## Dependencies

This module assumes the existence of a `JobHandlers` module that contains the logic (handler functions) for various job types. Make sure that the `JobHandlers` module is available and properly implemented.

## Job: "send campaign"

The "send campaign" job is associated with the `JobHandlers.sendCampaign` handler function. It defines the logic that should be executed when a job of this type is processed.

## Contributing

Contributions to enhance and improve the `campaignDefinitions` module are welcome. Feel free to create issues or submit pull requests.

<hr style="border: 0.05px solid blue;">

# Template 

The `templateDefinitions` module is responsible for defining jobs related to template synchronization using the **Agenda** job scheduling library. It utilizes the `JobHandlers` module to specify the logic associated with each job.

## Overview

In a messaging or job queue system, such as Agenda, jobs represent discrete units of work that need to be performed asynchronously. The `templateDefinitions` module defines a specific job named "sync templates" using the `define` method provided by the Agenda library.

## Usage

To use the `templateDefinitions` module, pass an instance of Agenda and call the `define` method with the desired job name and associated handler function. Typically, this would be done when initializing your application or setting up your job scheduler.

## Dependencies

This module assumes the existence of a `JobHandlers` module that contains the logic (handler functions) for various job types. Make sure that the `JobHandlers` module is available and properly implemented.

## Job: "sync templates"

The "sync templates" job is associated with the `JobHandlers.syncTemplates` handler function. It defines the logic that should be executed when a job of this type is processed.

## Contributing

Contributions to enhance and improve the `templateDefinitions` module are welcome. Feel free to create issues or submit pull requests.

