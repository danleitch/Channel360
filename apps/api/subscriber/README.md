## App

This is the main configuration file for the Channel360 Express API, which includes routes for managing subscribers, groups, and reporting metrics. The API is designed to support different versions (e.g., v1.1) and organizations.

### Technologies Used

- **Express**: A minimal and flexible Node.js web application framework.
- **MongoDB**: A NoSQL database used to store data, with an in-memory server for testing.
- **Sentry**: Used for error tracking and monitoring.
- **Cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **Express Async Errors**: Provides better error handling for asynchronous code.
- **Express Validator**: Middleware for data validation in Express routes.
- **Body Parser**: Middleware for parsing incoming request bodies.
- **Multer**: Middleware for handling multipart/form-data, used for file uploads.
- **CSVtoJSON**: Used for converting CSV data to JSON.
- **JWT**: JSON Web Token for user authentication.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set environment variables:

   Create a `.env` file in the root directory with the following content:

   ```env
   JWT_KEY=your-secret-key
   ```

4. Run the application:

   ```bash
   npm start
   ```

### API Routes

#### API Versioning

The API supports different versions. The current version is `v1.1`. All API routes under `/v1.1` require an API key for authentication.

#### Subscriber Routes

- **GET .../subscribers**: Retrieve a list of subscribers for a specific organization.

- **GET .../subscribers/:subscriberId**: Retrieve details of a specific subscriber within an organization.

- **POST .../subscribers**: Create a new subscriber for a specific organization.

- **PUT .../subscribers/:id**: Update details of a specific subscriber within an organization.

- **DELETE .../subscribers/:id**: Delete a specific subscriber within an organization.

- **DELETE .../subscribers**: Batch delete subscribers for a specific organization.

- **POST .../subscribers/import/:groupId?**: Import subscribers, optionally assigning them to a group.

- **GET .../subscribers/export**: Export subscribers for a specific organization.

#### Group Routes

- **POST .../group**: Create a new group for a specific organization.

- **GET .../group/:groupId**: Retrieve details of a specific group within an organization.

- **GET .../group**: Retrieve a list of groups for a specific organization.

- **DELETE .../group/:id**: Delete a specific group.

- **PUT .../group/:id**: Update details of a specific group.

- **GET .../:groupId/subscribers**: Retrieve subscribers for a specific group within an organization.

#### Reporting Routes

- **POST .../subscriber/reports**: Generate reports on subscriber metrics for a specific organization.

### WebAPI Routes

WebAPI routes are similar to API routes but do not require an API key. Instead, they use Cognito tokens for authentication.

### Error Handling

The application uses Sentry for error tracking and monitoring. If an endpoint is not found, a `NotFoundError` is thrown and handled in the error middleware.

### Testing

The application uses Jest for testing. Ensure to run the tests using:

```bash
npm test
```

This project includes mocks for external dependencies like <span style="color: green;">@sentry/node</span> and <span style="color: green;">@channel360/core</span>.

### Contributing

Feel free to contribute to the project by submitting issues or pull requests.

<hr style="border: 0.05px solid blue;">

# Index

This script initializes the Channel360 Subscriber Service, which is responsible for handling subscribers and organization-related events. It uses the Express app defined in `app.ts`.

## Service Initialization

The service is initialized using the `ServiceInitializer` class from `@channel360/core`. The initialization process includes setting up the NATS streaming server, checking required environment variables, and starting the Express app.

## Listeners

Several event listeners are registered during the service initialization. These listeners respond to specific events and perform actions accordingly. Here are the listeners used in this service:

- **OrganizationCreatedListener**: Listens for events related to the creation of organizations.

- **SubscriberOptListener**: Listens for events related to subscriber opt-ins.

- **OrganizationUpdatedListener**: Listens for events related to updates in organizations.

## Environment Variables

The service requires the following environment variables to be set:

- `JWT_KEY`: Secret key for JWT token generation.
- `MONGO_URI`: MongoDB connection URI.
- `NATS_URL`: NATS streaming server URL.
- `CLUSTER_ID`: NATS streaming server cluster ID.
- `NATS_CLIENT_ID`: NATS streaming server client ID.
- `SENTRY_DSN`: Sentry DSN for error tracking.
- `AWS_ACCESS_KEY_ID`: AWS access key for S3 integration.
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key for S3 integration.
- `AWS_COGNITO_CLIENT_ID`: AWS Cognito client ID.
- `AWS_COGNITO_CLIENT_SECRET`: AWS Cognito client secret.
- `AWS_COGNITO_REGION`: AWS Cognito region.
- `AWS_COGNITO_POOL_ID`: AWS Cognito user pool ID.

## Starting the Service

After the initialization process, the service logs a message indicating that the Subscriber Service has started.

```bash
Subscriber Service Started 
```

## Running the Service

To run the service, execute the following command:

```bash
npm start
```

<hr style="border: 0.05px solid blue;">

```markdown
# NATS Wrapper 

This module provides a wrapper for the NATS (NATS.io) connection used in the Channel360 Subscriber Service. It utilizes the NATS JetStream for message streaming and delivery.

## NatsWrapper Class

The `NatsWrapper` class is responsible for establishing a connection to the NATS server, creating a JetStream client, and setting up streams for specific event types.

### Properties:

- **client**: Provides access to the NATS client once connected.

- **jsClient**: Provides access to the JetStream client once connected and enabled.

### Methods:

- **connect(clientId: string, url: string, retryAttempts = 3, retryDelayMs = 1000)**: Attempts to connect to the NATS server with the specified parameters. Retries the connection if it fails. Once connected, initializes the JetStream client and sets up streams for specific event types.

## Dependencies

- `nats`: The NATS client library.

## Configuration

The `connect` method takes the following parameters:

- `clientId`: A unique identifier for the NATS client.
- `url`: The URL of the NATS server.
- `retryAttempts`: Number of retry attempts in case of connection failure (default: 3).
- `retryDelayMs`: Delay between retry attempts in milliseconds (default: 1000).

## NATS JetStream Configuration

The code includes an example of setting up a stream for handling group-related events. You can customize this section based on your specific event types and subjects.


This example adds a stream named "GROUP" and subscribes to three subjects related to group events.

## Error Handling

The module includes error handling for connection failures and initialization issues, logging relevant messages to the console.




