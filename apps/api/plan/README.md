# App

The Channel360 Organization Service is designed to handle CRUD operations for organization plans. Below is an overview of the key components of the service.

## Overview

The Organization Service is built using Node.js and Express, following best practices for a scalable and maintainable architecture. It includes routes for creating, updating, retrieving, and listing organization plans.

## Features

1. **Create Plan:**

   - Description: Allows super admins to create a new organization plan.
   - Validation: Requires title and a valid positive price.

2. **Update Plan:**

   - Description: Allows authenticated users to update an existing organization plan.
   - Validation: Requires title and a valid positive price.

3. **Show Plan:**

   - Description: Retrieves details of a specific organization plan.

4. **Index Plans:**
   - Description: Retrieves a list of all organization plans.

## Middleware

- **Error Handling:**

  - Utilizes the `express-async-errors` middleware for handling asynchronous errors.
  - Custom error handling middleware (`errorHandler`) is implemented to handle common errors, including `NotFoundError`.

- **Sentry Integration:**

  - Utilizes the Sentry SDK for error tracking and monitoring. Sentry is configured to log requests, traces, and errors.

- **Cookie Session:**

  - Configures `cookie-session` middleware for handling session data, although it currently does not seem to be used extensively.

- **CORS:**
  - Enables Cross-Origin Resource Sharing (CORS) to allow requests from different origins.

## Usage

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

```shell
git clone <repository-url>
```

2. Install dependencies:

```shell
npm install
```

### Running the Service

```bash
npm start
```

The service will be available at `http://localhost:3000`.

### Testing

```bash
npm test
```

Run the tests to ensure the functionality is working as expected.

## Recommendations

1. **Documentation:**

   - Add comprehensive documentation for API endpoints, request/response formats, and authentication mechanisms.

2. **Environment Variables:**

   - Ensure sensitive information, such as JWT keys and database URIs, are properly handled using environment variables.

3. **Authentication:**

   - Enhance authentication by adding roles and permissions to control access to different endpoints.

4. **Testing:**

   - Expand the test suite to cover a wider range of scenarios and edge cases.

5. **Sentry Configuration:**

   - Verify and configure Sentry to work seamlessly in different environments (development, staging, production).

6. **Enhancements:**
   - Consider additional features based on organizational needs, such as plan deletion, user subscriptions, etc.

<hr style="border: 0.05px solid blue;">

# Index

The Channel360 Plan Service is responsible for managing organization plans. It includes features for creating, updating, and retrieving plans. Below is an explanation of the key components and how to run the service.

## Components

### 1. **App (Express Application)**

The `app` module contains the main Express application that handles incoming HTTP requests and defines the service's routes.

### 2. **Nats Wrapper**

The `natsWrapper` module is responsible for establishing a connection to the NATS messaging system. It provides a wrapper around the NATS client and JetStream client, allowing seamless communication within the microservices architecture.

### 3. **Service Initializer**

The `ServiceInitializer` class initializes the required components for the service, such as the NATS connection, Express app, and other necessary configurations. It ensures that the service starts with the required environment variables.

## Configuration

Ensure that the following environment variables are set before starting the service:

- `JWT_KEY`: Secret key for JSON Web Token (JWT) authentication.
- `MONGO_URI`: MongoDB connection URI.
- `NATS_URL`: NATS server URL.
- `CLUSTER_ID`: NATS JetStream cluster ID.
- `NATS_CLIENT_ID`: NATS client ID.
- `SENTRY_DSN`: Sentry DSN for error tracking.

## Running the Service

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Service:**
   ```bash
   npm start
   ```

The service will be available at `http://localhost:3000`. Ensure that the required environment variables are set correctly.

## Testing

Run the tests to ensure the functionality is working as expected:

```bash
npm test
```

## Service Initialization

The service is initialized using the `ServiceInitializer` class. It establishes a connection to NATS, sets up error tracking with Sentry, and starts the Express app.

## Recommendations

1. **Environment Variables:**
   - Ensure that sensitive information, such as JWT keys and database URIs, are securely handled using environment variables.

2. **Documentation:**
   - Add comprehensive documentation for service initialization, configuration, and any additional features.

3. **Logging:**
   - Implement logging throughout the service to capture important events and facilitate troubleshooting.

4. **Monitoring:**
   - Integrate monitoring tools to keep track of service health and performance.

5. **Scaling:**
   - Consider strategies for scaling the service horizontally based on usage patterns.

6. **Security:**
   - Regularly review and update dependencies to address security vulnerabilities.

7. **Continuous Improvement:**
   - Continuously review and improve the service based on feedback and evolving requirements.

<hr style="border: 0.05px solid blue;">

# NATS Wrapper (Integration)

The Channel360 Plan Service uses NATS for communication within the microservices architecture. Below is an explanation of the key components related to NATS integration.

## 1. NATS Wrapper

The `NatsWrapper` class serves as a wrapper around the NATS client, providing functionalities for connecting to the NATS server and initializing JetStream. It includes the following key methods:

### `connect(clientId: string, url: string, retryAttempts = 3, retryDelayMs = 1000)`

This method establishes a connection to the NATS server, with support for retries in case of connection failures. It also initializes the JetStream client after successfully connecting to NATS.

### `client`

Getter method for accessing the NATS client. Throws an error if the client is accessed before connecting.

### `jsClient`

Getter method for accessing the JetStream client. Throws an error if the JetStream client is accessed before connecting and enabling JetStream.

## 2. Connecting to NATS

The `connect` method is responsible for establishing a connection to the NATS server. It includes the following steps:

1. **Connection Attempt:**
   - The method attempts to connect to the NATS server using the provided `clientId` and `url`.
   - If the connection is successful, it logs a message indicating that the service is connected to NATS JetStream.

2. **Connection Retry:**
   - If the connection attempt fails, the method retries the connection according to the specified number of `retryAttempts` and `retryDelayMs`.
   - It logs an error message if the connection fails and waits for the specified delay before attempting the next connection.

3. **JetStream Initialization:**
   - After successfully connecting to NATS, the method initializes the JetStream client.

4. **Stream Configuration:**
   - The method configures the streams required for the service. In this case, it adds a stream named "PLAN" with subjects for plan creation and updates.

5. **Connection Closure Handling:**
   - The method sets up handling for the closure of the NATS connection. It logs an error message if the connection is closed with an error.

6. **Completion Message:**
   - Once all configurations are completed, the method logs a completion message indicating that NATS JetStreams are registered.

## 3. Usage in the Service

The `natsWrapper` instance is exported and can be used throughout the service to access the NATS client and JetStream client. This allows the service to publish messages to NATS and subscribe to relevant subjects.

## 4. Recommendations

1. **Environment Variables:**
   - Ensure that sensitive information such as NATS credentials and URLs is securely handled using environment variables.

2. **Error Handling:**
   - Implement additional error handling and logging to capture and respond to potential issues during NATS connection and JetStream initialization.

3. **Stream Configuration:**
   - Customize stream configurations based on the specific needs of the service. Define subjects and stream settings according to the service's messaging requirements.

4. **Documentation:**
   - Provide documentation on how to configure NATS and JetStream for the service. Include any specific considerations or settings that might be relevant.



