# App
This README.md provides an overview of the Express.js application setup. The application includes various routes for managing campaigns, handling reports, and exporting data.

## Overview
This Express.js application is designed to manage campaigns, handle notifications, and provide APIs for various functionalities related to campaign management. The application uses several middleware for features such as authentication, error handling, and route organization.

## Dependencies
- __express:__ A fast, unopinionated, minimalist web framework for Node.js.
- __express-async-errors:__ An Express.js error-handling middleware for handling asynchronous errors.
- __body-parser:__ A middleware to parse incoming request bodies.
- __cookie-session:__ A middleware to manage session data using cookies.
- __cors:__ A middleware for enabling Cross-Origin Resource Sharing (CORS).
- __@sentry/node:__ A library for error tracking and monitoring.
- __@channel360/core:__ The core library for common functionalities in the application.

## Application Setup
#### 1 __Sentry Integration:__

- Sentry is integrated into the application for error tracking and monitoring. The `Sentry.Handlers` middleware is used for request handling, tracing, and error handling.

#### 2 __Middleware Setup:__
CORS middleware is configured to allow requests from any origin (`origin: true`).
The application trusts the proxy (`app.set("trust proxy", true)`) to work behind a reverse proxy.
JSON parsing middleware (`app.use(json())`) is used to parse incoming request bodies.

####  3 __Session Handling:__
Cookie sessions are configured using the `cookie-session` middleware with options for signed and non-secure cookies.

####  4 __User and Admin Middleware:__
Middleware functions (`currentUser` and `currentAdmin`) are used to set the current user and admin on the request object.

####  5 __API Routes:__
The application defines API routes using the apiRouter and webApiRouter. These routes handle various functionalities related to campaigns, reports, and recipients.

####  6 __Error Handling:__

The application includes a wildcard route (app.all("*")) to handle all undefined routes, throwing a NotFoundError. The errorHandler middleware is used to handle errors and send appropriate responses.

## Usage
To use this Express.js application, ensure that you have the necessary dependencies installed. You can run the application using the following command:

<hr style="border: 0.05px solid blue;">

# Index

This README.md provides an overview of the initialization process for the Campaign Service. The service is built using Express.js and includes various event listeners to handle messages from the NATS streaming server. Additionally, it uses the Service Initializer from the <span style="color: green;">@channel360/core</span> library for efficient service initialization.

## Overview
The Campaign Service is responsible for managing campaigns, templates, organizations, and other related entities. It includes an Express.js application that exposes API routes for various functionalities. The service communicates with other services and components via the NATS streaming server.

## Dependencies
The service depends on the following main components:

- __Express.js:__ A fast, unopinionated, minimalist web framework for Node.js.
- __NATS Streaming Server:__ A high-performance messaging system.
- __Service Initializer:__ A utility from the <span style="color: green;">@channel360/core</span> library for efficient service initialization.
- __Sentry:__ An error tracking and monitoring tool.

## Environment Variables
The service requires the following environment variables to be set:

- `JWT_KEY`: Secret key for JSON Web Token (JWT) authentication.
- `MONGO_URI`: MongoDB connection URI.
- `NATS_UR`L: NATS streaming server URL.
- `CLUSTER_ID`: NATS cluster ID.
- `NATS_CLIENT_ID`: NATS client ID.
- `SENTRY_DSN`: Sentry Data Source Name (DSN) for error tracking.
- `AWS_COGNITO_CLIENT_ID`: AWS Cognito client ID.
- `AWS_COGNITO_POOL_ID`: AWS Cognito user pool ID.

## Initialization
The service uses the `ServiceInitializer` from the <span style="color: green;">@channel360/core</span> library to initialize various components and event listeners efficiently. The `ServiceInitializer` takes care of setting up the Express.js application, connecting to MongoDB, connecting to the NATS streaming server, and initializing event listeners.

## Event Listeners
The service includes various event listeners that subscribe to specific channels on the NATS streaming server. These listeners handle events related to organization creation and updates, template creation and updates, group creation and deletion, settings creation and updates, API key creation and updates, and customer responses.

## Usage
To start the Campaign Service, ensure that all required environment variables are set and dependencies are installed. Then, run the service using the following command:

<hr style="border: 0.05px solid blue;">

# NATS Wrapper 
The `NatsWrapper` class in your Campaign Service is responsible for handling the connection to the NATS streaming server, creating NATS and JetStream clients, and configuring streams. Below is a breakdown of the key functionalities and configurations in the `NatsWrapper` class:

## Features
1. __Connection to NATS__
The `connect` method attempts to establish a connection to the NATS streaming server using the `connect` function from the `nats` library. It includes retry logic with a configurable number of attempts and delay between retries. The connection is authenticated using a user and password.

2. __JetStream Client Initialization__
Once connected to NATS, the JetStream client (`_jsClient`) is initialized. JetStream is used for advanced messaging features like persistent messaging with streams. The initialization includes retries to ensure a successful connection to the JetStream Manager.

3. __Stream Configurations__
The class defines stream configurations for different subjects related to your Campaign Service. Each stream configuration includes the stream name, subjects to subscribe to, and inherits default configuration settings (`defaultStreamConfiguration`). Stream configurations are defined for:

- `SUBSCRIBER-OPT`: Handles subscriber opt-in.
- `REPLY`: Handles reply messages creation.
- `CAMPAIGN`: Handles events related to campaign creation, update, and deletion.
- `APPUSER`: Handles events related to app user creation.

4. __Stream Initialization__
After initializing the JetStream client, the class registers the defined streams using the JetStream Manager. It checks if the JetStream Manager is successfully initialized before attempting to create streams.

5. __Graceful Shutdown__
The class handles the graceful shutdown of the NATS connection. It logs closure events and exits the process when the connection is closed.

6. __Singleton Pattern__
The NatsWrapper is implemented as a singleton, ensuring that only one instance of the wrapper is created throughout the application.

## Usage
To use the `NatsWrapper` in your Campaign Service:

#### 1 Import the `natsWrapper` instance:
#### 2  Call the connect method to establish a connection to NATS:
#### 3 Access the NATS and JetStream clients:
#### 4 Implement your logic using NATS and JetStream for publishing and subscribing to messages.
<hr style="border: 0.05px solid blue;">

# Subscriber Service 
The `subscriberService` function is designed to fetch subscribers from a subscriber group in your Campaign Service. Below is an explanation of the key features and usage of this service.

## Features
#### 1. Axios Request
The function utilizes the Axios library to make an HTTP GET request to fetch subscribers from a specified subscriber group. It constructs the URL based on the request protocol, host, organization ID, and subscriber group ID.

#### 2. Authorization Header
The function includes the `Authorization` header in the HTTP request, extracting it from the headers of the incoming Express request (`req`). This ensures that the request to the subscriber service is authorized.

#### 3. Handling Successful Response
If the HTTP request is successful, the function returns the array of subscribers extracted from the response data.

#### 4. Handling Axios Errors
The function uses `axios.isAxiosError` to check if the caught error is an Axios error. If it is, the function throws a `BadRequestError` with the error response data or a default message. This ensures that errors from the subscriber service are appropriately handled and converted into a consistent error format.

#### 5. Generic Error Handling
If the error is not an Axios error, the function throws a `BadRequestError` with a generic error message. This covers unexpected errors and provides a consistent error response.

## Usage
To use the `subscriberService` in your Campaign Service:

#### 1 Import the function.
#### 2 Call the function with the required parameters:
- `req`: The incoming Express request object.
- `subscriberGroup`: The ID of the subscriber group to fetch subscribers from.
- `organizationId`: The ID of the organization associated with the subscribers.
#### 3 Handle the returned `subscribers` array as needed for your campaign creation logic.
<hr style="border: 0.05px solid blue;">



