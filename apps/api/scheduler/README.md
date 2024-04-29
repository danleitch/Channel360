# App

The `app` module is responsible for configuring the Express application that hosts the Agendash dashboard for monitoring and managing scheduled jobs. It includes middleware for handling requests, connecting to the Agendash dashboard, and defining routes for error handling.

## Overview

The module uses the Express framework to create an HTTP server. It integrates the Agendash dashboard, which provides a web-based interface for viewing and managing scheduled jobs created by the Agenda scheduler.

## Usage

To use the `app` module, follow these steps:

1. Import necessary modules and dependencies.
2. Create an instance of the Express application.
3. Configure middleware, including CORS, JSON parsing, cookie sessions, and current user handling.
4. Connect to the Agendash dashboard using `Agendash(agenda)` middleware.
5. Start the Agenda scheduler using `await agenda.start()`.
6. Define a recurring job, such as syncing templates, using `await agenda.every("1 hour", "sync templates")`.
7. Define a catch-all route for handling requests to undefined routes.
8. Use the error handling middleware.

## Contributing

Contributions to enhance and improve the `app` module are welcome. Feel free to create issues or submit pull requests.


<hr style="border: 0.05px solid blue;">

# Index

The code you provided initializes the Scheduler service by connecting to NATS, setting up the Express application, and configuring listeners for specific events. The service uses the `ServiceInitializer` class to perform the initialization process.

## Overview

1. Import required modules and dependencies.
2. Create an instance of the `ServiceInitializer` class with necessary parameters (NATS wrapper, Express app, and required environment variables).
3. Add event listeners for specific events (`CampaignCreatedListener`, `CampaignUpdatedListener`, `CampaignDeletedListener`).
4. Call the `initialize` method of the `ServiceInitializer` to start the initialization process.
5. Print a message indicating that the Scheduler service has started.

## Usage

To use the initialization code:

1. Import the `app` instance from the specified `app` module.
2. Import the `natsWrapper` instance from the specified `nats-wrapper` module.
3. Create an instance of `ServiceInitializer` with the NATS wrapper, Express app, and the required environment variables.
4. Add event listeners using the appropriate listener classes.
5. Call the `initialize` method to start the initialization process.
6. Print a message to indicate that the service has started.

## Note

Ensure that the required environment variables are set before running the Scheduler service. The `ServiceInitializer` class helps organize and simplify the initialization process, making it easy to add additional listeners or services as needed.

## Contributing

Contributions to enhance and improve the initialization process are welcome. Feel free to create issues or submit pull requests.

<hr style="border: 0.05px solid blue;">

# NATS Wrapper 

The code you provided defines a class `NatsWrapper` that serves as a wrapper for connecting to NATS (NATS JetStream) and managing JetStream clients. This wrapper is designed to handle the connection to the NATS server, initialize the JetStream manager, and enable JetStream. Additionally, it provides methods to access the NATS client and JetStream client.

## Overview

1. **Class Definition (`NatsWrapper`):**
   - `private _client?: NatsConnection`: NATS client instance.
   - `private _jsClient?: JetStreamClient`: JetStream client instance.
   - `get client()`: Getter method to access the NATS client.
   - `get jsClient()`: Getter method to access the JetStream client.
   - `async connect(clientId, url, retryAttempts, retryDelayMs)`: Method to connect to NATS, initialize JetStream, and enable JetStream.

2. **Connect Method:**
   - Attempts to connect to the NATS server with retry logic.
   - If the connection is successful, it initializes the JetStream manager and enables JetStream.
   - Adds specific streams for campaigns and template synchronization.

3. **Error Handling:**
   - Handles errors during the connection and initialization process.
   - Implements retry logic to handle connection failures.

4. **Usage:**
   - The `natsWrapper` instance is exported, allowing other parts of the application to use the NATS connection and JetStream functionalities.

## Note

- Ensure that the required NATS server URL, credentials, and other configurations are set correctly.
- The streams (`SCHEDULER-CAMPAIGN` and `TEMPLATE-SYNC`) are added during the connection process, assuming that they are used for specific functionalities in your application.
- The retry logic provides resilience in case of connection failures.

