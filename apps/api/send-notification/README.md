# Express Application Setup

This is an example setup for an Express.js application. It includes configurations for middleware, error handling, and routing. The application is configured to handle requests for sending notifications through the `sendNotificationRouter` router.

## Features

### Middleware

- **Sentry Integration:** Utilizes the Sentry library for error tracking and monitoring. The middleware sets up request handlers, tracing, and error handling for Sentry.

- **CORS:** Enables Cross-Origin Resource Sharing with configuration for allowing requests from any origin and including credentials.

- **Cookie Session:** Configures the use of cookie sessions with options for signing and security.

- **JSON Parsing:** Parses incoming JSON payloads.

- **User Middleware:** Utilizes middleware for handling the current user and current admin in the request.

### Routing

- **Send Notification Router:** Handles routes related to sending notifications.

### Error Handling

- **Not Found Handler:** Throws a `NotFoundError` for any unhandled routes.

- **Error Handler:** Utilizes a custom error handler from <span style="color: green;">@channel360/core</span> for consistent error responses.

## Usage

1. Install dependencies: 

```bash
npm install
```
2. Run the application: 
```bash
npm start
```


<hr style="border: 0.05px solid blue;">

# Index

This script initializes the Send Notification Service. It includes configurations for essential environment variables and initializes necessary components such as the Express app, NATS wrapper, and event listeners.

## Features

- **Environment Variables:** The script checks for required environment variables and throws an error if any are missing.

- **Service Initializer:** Utilizes the `ServiceInitializer` class from <span style="color: green;">@channel360/core</span> to initialize the required components and environment variables.

- **NATS Event Listener:** Registers an event listener (`APIKeyCreatedListener`) to listen for API key creation events and handle them accordingly.

## Usage

1. Ensure you have the required environment variables set: `JWT_KEY`, `MONGO_URI`, `NATS_URL`, `CLUSTER_ID`, `NATS_CLIENT_ID`, and `SENTRY_DSN`.

2. Install dependencies: 
```bash
npm install
```

3. Run the service: 
```bash
npm start
```

4. The script initializes the service and logs "Send Notification Service Started" upon successful initialization.

<hr style="border: 0.05px solid blue;">

# NATS Wrapper

The provided code defines a `NatsWrapper` class responsible for connecting to the NATS server and initializing JetStream for the Send Notification Service. Below is an explanation of the key features and usage.

## Features

1. **Connection Handling:**
   - Connects to the NATS server with the provided credentials.
   - Implements retry logic with configurable attempts and delay in case of connection failures.

2. **JetStream Initialization:**
   - Initializes JetStream upon successful connection to the NATS server.
   - Uses the JetStream Manager to configure and enable JetStream.

3. **Stream Configuration:**
   - Configures a JetStream stream named 'NOTIFICATION' for handling notifications.
   - Specifies the subject 'notification:created' for this stream.

4. **Error Handling:**
   - Logs errors and retry attempts for both the NATS connection and JetStream Manager initialization.

## Usage

1. **Import:**
   - Import the `natsWrapper` instance into other parts of the Send Notification Service.

2. **Connect to NATS Server:**
   - Call the `connect` method with the required parameters to establish a connection.

3. **Access NATS Client and JetStream Client:**
   - Access the NATS client and JetStream client through the `client` and `jsClient` getters.

4. **Stream Configuration:**
   - The 'NOTIFICATION' stream is configured to handle the 'notification:created' subject.

5. **Error Handling:**
   - The class logs errors and retry attempts for better visibility into connection and initialization issues.


