#  API (Server)

The Channel360 platform API server is built using Express.js and includes various routes for user authentication, authorization, and related functionalities. Below is an overview of the key components and routes.

## Error Handling

The server uses the Sentry library for error handling and tracking. Sentry captures and logs errors for monitoring and debugging.

## Middleware, and Controller

#### `currentUser` Middleware
- Retrieves information about the currently authenticated user.
- __Usage:__ `app.use(currentUser)`.

#### `currentAdmin` Middleware
- Retrieves information about the currently authenticated admin.
- __Usage:__ `app.use(currentAdmin)`.

#### User Sign-In
- __Middleware:__ `SIGNIN_VALIDATION`, `validateRequest`
- __Controller:__ `UserSignInController`

#### User Sign-Up
- __Middleware:__ `SIGNUP_VALIDATION`, `validateRequest`
- __Controller:__ `UserSignUpController`

#### Verify User Account
- __Middleware:__ `VERIFY_ACCOUNT_VALIDATION`, `validateRequest`
- __Controller:__ `VerifyAccountController`

#### Sign Out User
- __Middleware:__ `SIGNOUT_VALIDATION`, `validateRequest`
- __Controller:__ `UserSignOutController`

#### Refresh User Token
- __Middleware:__ `REFRESH_TOKEN_VALIDATION`, `validateRequest`
- __Controller:__ `RefreshTokenController`

#### Password Recovery
- __Middleware:__ `FORGOT_PASSWORD_VALIDATION`, `validateRequest`
- __Controller:__ `ForgotPasswordController`

#### Resend Verification Email
- __Middleware:__ `RESEND_VERIFICATION_VALIDATION`, `validateRequest`
- __Controller:__ `UserResendVerificationController`

### User and Admin Information Routes

#### Get Current User Information
- __Middleware:__ `currentUser`
- __Controller:__ Retrieves information about the currently authenticated user.

#### Get Current Admin Information
- __Middleware:__ `currentAdmin`
- __Controller:__ Retrieves information about the currently authenticated admin.

### Group Routes (Removed for Brevity)

## Default Route

If none of the specified routes match, a `NotFoundError` is thrown.

### Default Route
- __Middleware:__ Throws a `NotFoundError`.
- __Usage:__ `app.all('*', async () => { throw new NotFoundError(); })`.

## Conclusion

This API server handles user authentication, authorization, and related functionalities, providing a secure and structured platform for Channel360.

<hr style="border: 0.05px solid blue;">

#  Initialization

This script initializes the Channel360 Auth Service. It performs the following tasks:

1. Configures AWS SDK with necessary credentials and region.
2. Sets up the required environment variables.
3. Initializes essential services using the `ServiceInitializer` class.

## Prerequisites

Make sure the following environment variables are set before running the script:

- `JWT_KEY`: JSON Web Token secret key for user authentication.
- `ADMIN_JWT_KEY`: JSON Web Token secret key for admin authentication.
- `MONGO_URI`: MongoDB connection URI.
- `NATS_URL`: NATS streaming server URL.
- `CLUSTER_ID`: NATS cluster ID.
- `NATS_CLIENT_ID`: NATS client ID.
- `SENTRY_DSN`: Sentry error tracking DSN (Data Source Name).
- `SITE_URL`: URL of the Channel360 site.
- `AWS_ACCESS_KEY_ID`: AWS Access Key ID for AWS services.
- `AWS_SECRET_ACCESS_KEY`: AWS Secret Access Key for AWS services.
- `AWS_COGNITO_CLIENT_ID`: AWS Cognito client ID for user authentication.
- `AWS_COGNITO_CLIENT_SECRET`: AWS Cognito client secret for user authentication.
- `AWS_COGNITO_REGION`: AWS Cognito region for user authentication.
- `AWS_COGNITO_POOL_ID`: AWS Cognito pool ID for user authentication.

## Installation and Execution

1. Install the required dependencies:
   ```bash
   npm install
   ```

<hr style="border: 0.05px solid blue;">

# NatsWrapper Class

The `NatsWrapper` class is responsible for establishing and managing a connection to a NATS server, specifically for NATS JetStream. It provides a simple wrapper around the NATS client and JetStream client, with additional functionality for connecting, handling retries, and configuring JetStream streams.

## Usage

To use the `NatsWrapper` class in your application, follow these steps:

1. **Import the class:**

    ```typescript
    import { natsWrapper } from "./path-to-your-nats-wrapper-file";
    ```

2. **Initialize the connection:**

    ```typescript
    const clientId = "your-client-id";
    const natsServerUrl = "nats://your-nats-server-url";
    const retryAttempts = 3;
    const retryDelayMs = 1000;

    await natsWrapper.connect(clientId, natsServerUrl, retryAttempts, retryDelayMs);
    ```

3. **Access the NATS and JetStream clients:**

    ```typescript
    const natsClient = natsWrapper.client;
    const jetStreamClient = natsWrapper.jsClient;
    ```

4. **Use the clients for publishing and subscribing to messages as needed.**

## Configuration

The `NatsWrapper` class uses a retry mechanism to handle connection issues. The configuration for the NATS connection includes:

- `clientId`: The client ID for the NATS connection.
- `url`: The URL of the NATS server.
- `retryAttempts`: The maximum number of retry attempts.
- `retryDelayMs`: The delay between retry attempts in milliseconds.

## JetStream Configuration

Once connected, the JetStream client is initialized and streams are configured. Two example streams, 'USER' and 'ADMIN', are configured with specific subjects. Additional streams can be added or modified as needed.

## Environment Variables

Make sure to set the following environment variables before running the application:

- `NATS_URL`: URL of the NATS server.
- `NATS_CLIENT_ID`: Client ID for the NATS connection.
- `NATS_USER`: NATS username.
- `NATS_PASS`: NATS password.

## Error Handling

The class handles connection errors and JetStream initialization errors. If the maximum retry attempts are exceeded, an error is thrown.

## Dependencies

The class relies on the `nats` library for NATS connections. Ensure to install the required dependencies:

```bash
npm install nats
```



