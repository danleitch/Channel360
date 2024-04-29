#  App

This README provides an overview of the Channel360 Express app's structure and setup, including key middleware functions and routes.

## Middleware Setup

The following middleware functions are set up in the Channel360 Express app:

#### 1. CORS and Proxy Trust Setup

#### 2. Body Parser and Cookie Session

#### 3. Current User Middleware

This middleware is responsible for extracting the user data from the request.

## Routes Setup

The app uses separate routers for different sets of routes. Here are the key setups:

### 1. API Router

This router handles API routes related to template ingestion.

### 2. Web API Router

This router handles web API routes, specifically for refreshing templates.

<hr style="border: 0.05px solid blue;">

# Channel360 Template Sync Service

This README provides an overview of the Channel360 Template Sync Service, including the initialization process and event listeners.

## Environment Variables

The Channel360 Template Sync Service requires the following environment variables:

- `JWT_KEY`: JSON Web Token secret key
- `MONGO_URI`: MongoDB connection URI
- `NATS_URL`: NATS server URL
- `CLUSTER_ID`: NATS cluster ID
- `NATS_CLIENT_ID`: NATS client ID
- `SENTRY_DSN`: Sentry Data Source Name

Ensure these variables are properly configured before running the service.

## Service Initialization

The service is initialized using the `ServiceInitializer` class, which ensures the required environment variables are present. Additionally, the initializer registers event listeners and starts the service.

## Event Listeners

The service registers the following event listeners:

1. **Template Sync Listener (`TemplateSyncListener`):**
   - Listens for events related to template synchronization.

2. **Smooch App Created Listener (`SmoochAppCreatedListener`):**
   - Listens for events indicating the creation of a Smooch app.

3. **Smooch App Deleted Listener (`SmoochAppDeletedListener`):**
   - Listens for events indicating the deletion of a Smooch app.



<hr style="border: 0.05px solid blue;">

# Channel360 NATS Wrapper

The NATS (NATS.io) wrapper is a utility class that provides a convenient interface to connect to NATS servers and JetStream. This README provides an overview of the NATS wrapper, its usage, and the connection setup.

## Usage

The `NatsWrapper` class is designed to connect to NATS servers and enable JetStream. The wrapper allows access to both the NATS client and JetStream client, providing a clean interface for interaction.

## Connection Setup

The `connect` method is responsible for establishing a connection to the NATS server and enabling JetStream. It includes retry logic with configurable attempts and delays.



Ensure that the necessary environment variables (e.g., NATS_URL, CLUSTER_ID, NATS_CLIENT_ID) are set before calling the `connect` method.

## Streams Configuration

The wrapper includes a section for configuring JetStream streams. In the provided code, a template stream (`TEMPLATE`) is configured with specific subjects related to template events.
