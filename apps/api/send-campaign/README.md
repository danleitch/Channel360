# App 

This is a basic setup for an Express.js application with middleware for error handling, JSON parsing, cookie sessions, and CORS. The application uses `express-async-errors` for handling asynchronous errors and integrates with Sentry for error tracking.

## Features

### 1. **Sentry Integration**

   The application integrates with Sentry for error tracking. It uses the `@sentry/node` package to capture and report errors.

### 2. **CORS Configuration**

   CORS (Cross-Origin Resource Sharing) is configured using the `cors` middleware. It allows requests from all origins and includes credentials.

### 3. **Trust Proxy**

   The `trust proxy` setting is enabled to ensure that the application correctly identifies the client's IP address when it is behind a reverse proxy.

### 4. **JSON Parsing**

   The application uses the `body-parser` middleware (`json` method) to parse incoming JSON requests.

### 5. **Cookie Session**

   Cookie sessions are configured using the `cookie-session` middleware. The `secure` option is set to `false` for development purposes. In a production environment, this should be set to `true` if the application is served over HTTPS.

### 6. **Custom Middleware**

   - `currentUser` and `currentAdmin` are middleware functions for setting the current user and current admin on the request object.
   
### 7. **Not Found Route**

   An error handling route for handling undefined routes. If a route is not defined, it throws a `NotFoundError` that gets caught by the error handling middleware.

### 8. **Error Handling Middleware**

   The `errorHandler` middleware is used to handle errors. It responds with a formatted JSON error message, including the error status code and an array of error messages.

## Installation and Run

To run the application:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the application:

   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Environment Variables

Ensure that the following environment variables are set:

- `SENTRY_DSN`: Your Sentry DSN for error tracking.

**Note:** In a production environment, consider using HTTPS and set `secure: true` for the cookie session middleware. Adjust the CORS configuration and other settings based on your specific requirements.

Feel free to modify the code based on your project's needs. For more details on individual packages and configurations, refer to their respective documentation.

This README provides a quick overview of the Express app's features and setup. For more detailed explanations of specific functionalities, refer to the corresponding sections in your codebase.

<hr style="border: 0.05px solid blue;">

# Send Campaign Service

This script initializes the Send Campaign service. It uses the Channel360 core for service initialization and sets up a NATS listener for handling campaign sends. Ensure that the required environment variables are set before running the service.

## Installation and Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the service:

   ```bash
   npm start
   ```

The service will connect to NATS, set up the Express app, and start listening for campaign send events.

## Environment Variables

Ensure that the following environment variables are set:

- `JWT_KEY`: Secret key for JSON Web Token (JWT) authentication.
- `MONGO_URI`: MongoDB connection URI.
- `NATS_URL`: NATS server URL.
- `CLUSTER_ID`: NATS cluster ID.
- `NATS_CLIENT_ID`: NATS client ID.
- `SENTRY_DSN`: Sentry DSN for error tracking.

## Service Initialization

The `ServiceInitializer` from the Channel360 core is used for service initialization. It ensures that the required environment variables are present and initializes the necessary components.

## Campaign Send Listener

A `CampaignSendListener` is set up to listen for campaign send events using the NATS client. This listener handles the logic for sending campaigns.

## Start Message

Once the service is initialized, a "Send Campaign Service Started" message will be logged.

<hr style="border: 0.05px solid blue;">

# NATS Wrapper 

This script provides a wrapper class for NATS (NATS.io) with JetStream support. The NATS (NATS.io) messaging system is used for efficient communication between microservices. JetStream, an optional component of NATS, is used for persistent storage and replay of messages.

## Usage

### Initialization

To use the NATS wrapper, first, import it into your application. Then, connect to NATS and initialize JetStream:.

### Accessing NATS and JetStream Clients

Once connected, you can access the NATS and JetStream clients.

### Stream Configuration

The script includes a sample configuration for setting up a JetStream stream. Modify the `notificationsStreamConfig` according to your application's needs.

### Closing the Connection

The connection is automatically closed when the process exits. However, you can manually close it.

## Configuration

Adjust the `clientId`, `natsUrl`, `retryAttempts`, and `retryDelayMs` variables according to your NATS server setup.

<hr style="border: 0.05px solid blue;">

# Subscriber Service

This script defines a service function for fetching subscribers from an API. It utilizes the Axios library for making HTTP requests and handles errors using an error library (in this case, `BadRequestError` from `@channel360/common`). 

## Usage
To use the `subscriberService` function, you must import it into your application.

## Function Explanation
### Request URL
This line constructs the base URL using the protocol and host from the provided Express Request object (`req`).

### Axios Request

The **Axios Request** uses Axios to send a GET request to the specified API endpoint. It includes the organization ID, subscriber group, and an optional query parameter (`all=true`). The request also includes the Authorization header extracted from the original request.

<hr style="border: 0.05px solid blue;">

# Subscriber Service

This script defines a service function, `subscriberService`, which fetches subscribers from an API. It uses the Axios library for making HTTP requests and handles errors using the `BadRequestError` from <span style="color: green;">@channel360/core</span>. Below is an explanation of the key components of the script.

## Usage

To use the `subscriberService` function, you must import it into your application.


## Function Explanation

### Request URL
The line constructs the base URL using the protocol and host from the provided Express Request object (`req`).

### Axios Request

The **Axios Request** code uses Axios to send a GET request to the specified API endpoint. It includes the organization ID, subscriber group, and an optional query parameter (`all=true`). The request also includes the Authorization header extracted from the original request.

