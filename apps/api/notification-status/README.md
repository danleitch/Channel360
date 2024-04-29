# App

This document provides an overview of the Express.js application. The application is designed to handle HTTP requests, utilizing various middleware and error handling mechanisms.

## Dependencies

The application relies on the following dependencies:

- **express**: A fast, unopinionated, minimalist web framework for Node.js.
- **express-async-errors**: A utility to simplify error handling in asynchronous Express routes.
- **body-parser**: Middleware to parse incoming request bodies.
- **cookie-session**: Middleware to handle session data stored in cookies.
- **@channel360/core**: Custom middleware and error classes for user authentication and error handling.
- **cors**: Middleware for handling Cross-Origin Resource Sharing.

## Configuration

The application uses the `cookie-session` middleware for handling session data. Ensure that the necessary environment variables, such as `JWT_KEY` and others, are properly configured.

## Middleware

### Custom Middleware

- **currentUser**: Middleware to extract the current user information from the request.
- **currentAdmin**: Middleware to extract the current admin information from the request.

### Additional Middleware

- **cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **body-parser**: Middleware to parse incoming request bodies.
- **cookie-session**: Middleware for handling session data stored in cookies.

## Error Handling

The application uses the `@channel360/core` package for custom error handling. The `NotFoundError` is thrown when a requested route is not found. The `errorHandler` middleware captures and formats these errors for a consistent response.

## How to Run
1. Install dependencies: 

```shell
npm install
```

2. Start the application: 
```shell
npm start
```

<hr style="border: 0.05px solid blue;">

# Index

This document provides an overview of the Notification Status Service, including its components, initialization process, and how to run the service.

## Dependencies

The service relies on the following dependencies:

- **<span style="color: green;">@channel360/core</span>**: Core package providing service initialization, common functionalities, and event handling.
- **event/listeners/notification-status-listener**: Event listener for processing notification status events.
- **event/listeners/notification-sent-listener**: Event listener for processing notification sent events.

## Configuration

The service requires the following environment variables to be properly configured:

- **JWT_KEY**: Secret key for JSON Web Token (JWT) generation and validation.
- **MONGO_URI**: MongoDB connection URI.
- **NATS_URL**: URL for the NATS Streaming Server.
- **CLUSTER_ID**: NATS Streaming cluster ID.
- **NATS_CLIENT_ID**: Unique identifier for the NATS client.
- **SENTRY_DSN**: Sentry DSN (Data Source Name) for error tracking.

Ensure that these environment variables are set before running the service.

## Service Initialization

The service is initialized using the `ServiceInitializer` class from the <span style="color: green;">@channel360/core</span> package. The initializer configures the NATS wrapper, Express.js app, and required environment variables. It also sets up event listeners for notification status and notification sent events.

## How to Run

1. Install dependencies: 

```shell
npm install
```
2. Set the required environment variables.
3. Start the service: 

```shell
npm start
```

<hr style="border: 0.05px solid blue;">

# NATS Wrapper 

This document provides an overview of the NATS Wrapper used in the Notification Status Service, including its purpose, usage, and how to connect to the NATS server.

The `natsWrapper` instance exposes the `client` and `jsClient` properties, which provide access to the NATS and JetStream clients, respectively.

Ensure that the NATS Wrapper is connected to the NATS server before accessing the clients.

## Connection Configuration

The NATS Wrapper allows configuration of the NATS connection by specifying the NATS server URL, client ID, and optional retry settings.

- `clientId`: Unique identifier for the NATS client.
- `url`: URL of the NATS server.
- `retryAttempts`: Number of retry attempts in case of connection failure (default is 3).
- `retryDelayMs`: Delay between retry attempts in milliseconds (default is 1000ms).

## Connecting to NATS Server

To establish a connection to the NATS server, call the `connect` method on the NATS Wrapper instance.

## JetStream Initialization

After connecting to the NATS server, the NATS Wrapper initializes JetStream by obtaining the JetStream Manager and enabling JetStream.

