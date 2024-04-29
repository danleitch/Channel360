# App

## Overview

This README provides an overview of the structure and functionality of the application. The application is built using Express.js and includes various API requests related to Smooch integration, conversation history, notifications, and more.

## Application Structure

### Sentry Integration

The application includes Sentry integration for error tracking. Requests are logged using Sentry's `requestHandler` and `tracingHandler`. Errors are captured using `errorHandler`.

### Middlewares

- **CORS**: Cross-Origin Resource Sharing middleware is configured to allow requests from any origin.
- **JSON Parser**: JSON request body parsing using `body-parser`.
- **Cookie Session**: Cookie session middleware for handling user sessions.

### Authentication

- `currentUser` middleware extracts the current user from the session.
- `currentAdmin` middleware extracts the current admin from the session.

### API Routes

API routes are organized using Express Routers. The main API router is protected by `requireAuth` middleware.

### Web API Routes

Web API routes are organized similarly to API routes but with different authentication and validation middlewares.

### Error Handling

Errors are handled using a custom `errorHandler` that returns standardized error responses.

---

## API Middleware & Description

1. **Reply to Messages**
   - **Middleware**: `requireOrg(Organization)`, `replyRouter`
   - **Description**: Handles replies to messages from a specific app user.

2. **Conversation History**
   - **Middleware**: `conversationHistoryRouter`
   - **Description**: Retrieves conversation history for a specific subscriber.

3. **Create Notification**
   - **Middleware**: `createNotificationRouter`
   - **Description**: Creates and sends notifications to users.

4. **Unassign Smooch App**
   - **Middleware**: `unassignSmoochAppRouter`
   - **Description**: Unassigns a Smooch app from an organization.

5. **Show Smooch App**
   - **Middleware**: `showSmoochAppRouter`
   - **Description**: Retrieves details of a specific Smooch app.

6. **Get Smooch App by Organization ID**
   - **Middleware**: `getSmoochAppByOrgIdRouter`
   - **Description**: Retrieves Smooch app details based on organization ID.

7. **Assign Smooch App**
   - **Middleware**: `assignSmoochAppRouter`
   - **Description**: Assigns a Smooch app to an organization.

8. **Refresh Integrations**
   - **Middleware**: `refreshIntegrationsRouter`
   - **Description**: Refreshes Smooch integrations for an organization.

9. **Report Messages**
   - **Middleware**: `reportMessagesRouter`
   - **Description**: Reports messages for analysis.

10. **Create Template**
    - **Middleware**: `newTemplatesRouter`
    - **Description**: Creates new message templates for an organization.

---

## Web API Middleware & Description

1. **Reply to Messages**
   - **Middleware**: `replyRouter`
   - **Description**: Handles replies to messages from a specific app user.

2. **Conversation History**
   - **Middleware**: `conversationHistoryRouter`
   - **Description**: Retrieves conversation history for a specific subscriber.

3. **Create Notification**
   - **Middleware**: `createNotificationRouter`
   - **Description**: Creates and sends notifications to users.

4. **Unassign Smooch App**
   - **Middleware**: `unassignSmoochAppRouter`
   - **Description**: Unassigns a Smooch app from an organization.

5. **Show Smooch App**
   - **Middleware**: `showSmoochAppRouter`
   - **Description**: Retrieves details of a specific Smooch app.

6. **Get Smooch App by Organization ID**
   - **Middleware**: `getSmoochAppByOrgIdRouter`
   - **Description**: Retrieves Smooch app details based on organization ID.

7. **Assign Smooch App**
   - **Middleware**: `assignSmoochAppRouter`
   - **Description**: Assigns a Smooch app to an organization.

8. **Refresh Integrations**
   - **Middleware**: `refreshIntegrationsRouter`
   - **Description**: Refreshes Smooch integrations for an organization.

9. **Report Messages**
   - **Middleware**: `reportMessagesRouter`
   - **Description**: Reports messages for analysis.

10. **Create Template**
    - **Middleware**: `newTemplatesRouter`
    - **Description**: Creates new message templates for an organization.

---

## Error Handling

The application uses a custom `errorHandler` middleware to handle errors and return standardized error responses. If a route does not match any of the defined routes, a `NotFoundError` is thrown.

<hr style="border: 0.05px solid blue;">

# Index

This README provides an overview of the service initialization script. The script initializes the main application, sets up listeners for various events using the NATS streaming server, and ensures that the required environment variables are present.


## Application Initialization

The application is initialized using the `app` from the `app.ts` file. This includes setting up the Express.js server, configuring middleware, and defining routes.

## NATS Event Listeners

The script registers several event listeners for various events that are critical to the functioning of the service. These listeners include:

- `OrganizationCreatedListener`: Listens for organization creation events.
- `OrganizationUpdatedListener`: Listens for organization update events.
- `SettingsCreatedListener`: Listens for settings creation events.
- `SettingsUpdatedListener`: Listens for settings update events.
- `ReplyListener`: Listens for reply events.
- `NotificationListener`: Listens for notification creation events.

## Service Initialization

The `ServiceInitializer` class is responsible for initializing the NATS streaming server connection, setting up the Express application, and running the specified initialization tasks.

## Required Environment Variables

The script checks for the presence of required environment variables before initializing the service. If any of the required variables are missing, an error will be thrown, and the service won't start.

<hr style="border: 0.05px solid blue;">

# NATS Wrapper 

This README provides an overview of the NATS wrapper initialization script. The script initializes the NATS streaming server connection and sets up JetStream for various streams used in the application.

## NATS Connection Initialization

The `NatsWrapper` class is responsible for initializing the NATS connection. It uses the `connect` method from the `nats` library to establish a connection with the NATS server.

## JetStream Initialization

Once the NATS connection is established, the script initializes JetStream. It uses the `jetstreamManager` method to get the JetStream Manager and then enables JetStream using the `jetstream` method.

## Stream Configuration

The script configures several streams using the JetStream Manager (`jsm`). It defines configurations for streams such as `whatsappTemplateStream`, `smoochAppStream`, `notificationStream`, and `messageAppUserStream`. These streams have specific subjects for different types of events.

## Handling Connection Closure

The script handles the closure of the NATS connection by listening to the `closed` event. If the connection is closed due to an error, it logs an error message. Otherwise, it logs a success message and exits the process.

