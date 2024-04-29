# API (Express Server)

This document provides an overview of the Channel360 Express server implementation. The server is designed to handle various routes related to organization management, user authentication, and API key handling.

The Channel360 Express server is built using the Express.js framework. It is responsible for handling incoming requests, managing routes, and providing various functionalities related to organization management, user authentication, and API key handling.

## Server Structure

The server is structured into various modules, each handling a specific set of routes or functionalities. Here are some key components:

- **Routes:**
  - `showOrganizationRouter`: Retrieves information about a specific organization.
  - `allOrganizationRouter`: Retrieves information about all organizations.
  - `assignPlanRouter`: Assigns a plan to an organization.
  - `assignUserToOrganizationRouter`: Assigns a user to an organization.
  - `removeUserFromOrganizationRouter`: Removes a user from an organization.
  - `indexOrganizationReportRouter`: Retrieves metrics and reports for organizations.
  - `getOrganizationByUserRouter`: Retrieves organizations associated with a user.
  - `getOrganizationByCurrentUserRouter`: Retrieves organizations associated with the current user.
  - `inviteUserToOrganizationRouter`: Handles user invitations to organizations.
  - `newOrganizationRouter`: Creates a new organization.
  - `OrganizationUpdatedRouter`: Updates organization details.
  - `RequestTokenRouter`: Handles the request for an API key for an organization.
  - `RevokeTokenRouter`: Handles the revocation of an API key for an organization.

- **Middleware:**
  - `validateCognitoToken`: Validates Cognito tokens.
  - `requireAdminGroup`: Ensures the user belongs to the admin group.
  - `validateCognitoTokenAndOrganization`: Validates Cognito tokens and organization association.
  - `requireAuth`: Requires user authentication.
  - `requireOrg`: Ensures the organization is valid.
  - `requireSuperAdmin`: Requires super admin privileges.

## API 

The API routes are organized into three main categories:

1. **Legacy API:**
   - Contains routes that follow a legacy structure.
   - Requires admin and user authentication.

2. **Admin Web API:**
   - Contains routes for administrative purposes.
   - Requires Cognito token validation and admin group membership.

3. **Web API:**
   - Contains routes for general organization and user management.
   - Requires Cognito token validation and organization association validation.

4. **User API:**
   - Contains routes related to user organizations.
   - Requires Cognito token validation.

## Middleware

Middleware functions are used to perform various checks and validations before handling the actual route logic. Key middleware functions include:

- **`validateCognitoToken`:** Validates Cognito tokens.
- **`requireAdminGroup`:** Ensures the user belongs to the admin group.
- **`validateCognitoTokenAndOrganization`:** Validates Cognito tokens and checks organization association.
- **`requireAuth`:** Requires user authentication.
- **`requireOrg`:** Ensures the organization is valid.
- **`requireSuperAdmin`:** Requires super admin privileges.

## Error Handling

Error handling is implemented using the `express-async-errors` package and the `errorHandler` middleware. It catches asynchronous errors and passes them to the error handling middleware, which then sends an appropriate error response.

<hr style="border: 0.05px solid blue;">

# Channel360 Organization Service

This document provides an overview of the Channel360 Organization Service. The service is responsible for managing organizations, users, plans, and handling related events.

The Channel360 Organization Service is built to manage organizations, users, plans, and related events. It utilizes Express.js for handling HTTP requests, NATS for event-driven communication, and integrates with AWS services for authentication and storage.

## Getting Started

### Prerequisites

Before running the service, ensure you have the following installed:

- Node.js
- npm
- MongoDB
- NATS Server

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   cd channel360-organization-service
   npm install
   ```

3. Set up environment variables as per [Environment Variables](#environment-variables).

4. Run the service:

   ```bash
   npm start
   ```

## Service Components

### Express App (`app`)

The Express app (`app`) handles incoming HTTP requests, defines API routes, and integrates middleware for authentication, error handling, and more.

### NATS Wrapper (`nats-wrapper`)

The NATS wrapper (`nats-wrapper`) provides a connection to the NATS streaming server and serves as the foundation for event-driven communication within the service.

### Event Listeners

Event listeners handle various events emitted by the service. The following listeners are implemented:

- `UserCreatedListener`: Listens for user creation events.
- `UserUpdatedListener`: Listens for user update events.
- `PlanCreatedListener`: Listens for plan creation events.
- `PlanUpdatedListener`: Listens for plan update events.

## Configuration

The service is configured to use AWS services for authentication and storage. Ensure that the required environment variables are set, as specified in [Environment Variables](#environment-variables).

## AWS SDK Configuration

The service uses the AWS SDK for Node.js to interact with AWS services. The SDK is configured with the required credentials and region. Make sure to set the following environment variables:

- `AWS_ACCESS_KEY_ID`: AWS access key ID.
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key.
- `AWS_COGNITO_CLIENT_ID`: AWS Cognito client ID.
- `AWS_COGNITO_CLIENT_SECRET`: AWS Cognito client secret.
- `AWS_COGNITO_REGION`: AWS Cognito region.
- `AWS_COGNITO_POOL_ID`: AWS Cognito user pool ID.

## Service Initialization

The service is initialized using the `ServiceInitializer` class. It ensures that the necessary components, such as Express, NATS, and event listeners, are properly initialized before starting the service.

## Environment Variables

The service requires the following environment variables to be set:

- `JWT_KEY`: Secret key for JWT token generation.
- `MONGO_URI`: MongoDB connection URI.
- `NATS_URL`: NATS server URL.
- `CLUSTER_ID`: NATS cluster ID.
- `NATS_CLIENT_ID`: NATS client ID.
- `SENTRY_DSN`: Sentry DSN for error tracking.
- `SITE_URL`: URL of the service's website.
- `AWS_ACCESS_KEY_ID`: AWS access key ID.
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key.
- `AWS_COGNITO_CLIENT_ID`: AWS Cognito client ID.
- `AWS_COGNITO_CLIENT_SECRET`: AWS Cognito client secret.
- `AWS_COGNITO_REGION`: AWS Cognito region.
- `AWS_COGNITO_POOL_ID`: AWS Cognito user pool ID.

## License

This project is licensed under the MIT License.

Feel free to customize this template based on your specific project details.

<hr style="border: 0.05px solid blue;">

# NATS Wrapper

The `NatsWrapper` class in the Channel360 Organization Service is designed to handle the connection to the NATS server and facilitate communication using JetStream. It provides methods for connecting to NATS, initializing JetStream, and configuring streams for specific entities. This README provides an overview of the class and its functionality.

## Overview

The `NatsWrapper` class is a singleton responsible for managing the NATS connection and JetStream client. It is designed to be used as a wrapper around the NATS and JetStream libraries.

### Key Features:

1. **NATS Connection:**
   - Establishes a connection to the NATS server.
   - Handles retry logic in case of connection failure.

2. **JetStream Initialization:**
   - Initializes the JetStream client after a successful NATS connection.
   - Manages the connection to the JetStream manager.

3. **Stream Configuration:**
   - Configures JetStream streams for specific entities, such as organizations, settings, and API keys.

4. **Error Handling:**
   - Handles errors during NATS and JetStream initialization.
   - Provides logging for better debugging.

## Configuration

The `connect` method configures JetStream streams for the following entities:

1. **Organization Stream:**
   - Name: "ORGANIZATION"
   - Subjects: ["organization:created", "organization:updated"]

2. **Settings Stream:**
   - Name: "SETTINGS"
   - Subjects: ["settings:created", "settings:updated"]

3. **APIKey Stream:**
   - Name: "APIKEY"
   - Subjects: ["apiKey:created", "apiKey:updated"]

## Environment Variables

The `NatsWrapper` class relies on the following environment variables:

- `NATS_URL`: The URL of the NATS server.
- `CLUSTER_ID`: The NATS cluster ID.

Ensure these environment variables are set before initializing the `NatsWrapper` class.

## Error Handling

The class provides error handling for connection failures and initialization issues. It logs relevant error messages for debugging purposes.

## Closing the Connection

The `NatsWrapper` class listens for the `closed` event of the NATS client. When the connection is closed, it logs the closure reason and exits the process.

