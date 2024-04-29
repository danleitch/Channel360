# Services Documentation

This documentation provides an overview of the services included in the project.

## Webhook Service

The Webhook Service is responsible for managing webhooks associated with a Smooch App. It interacts with the Smooch API to add webhooks for handling various events.

### Usage

1. **Initialize Webhook Service:**
   - `smoochApiClient`: An instance of the Smooch API client.
   - `organizationId`: The ID of the organization associated with the Smooch App.
   - `baseUrl`: The base URL of the application.

2. **Add Webhooks:**
   - Adds necessary webhooks for handling events.

## Integration Service

The Integration Service is responsible for refreshing integrations associated with a Smooch App. It interacts with the Smooch API to refresh integrations.

### Usage

1. **Initialize Integration Service:**
   - `smoochApiClient`: An instance of the Smooch API client.

2. **Refresh Integrations:**
   - Refreshes integrations associated with the Smooch App.

## How to Use

1. Import the services in your project:

2. Initialize the services with the required parameters.

3. Use the provided methods to perform actions such as adding webhooks or refreshing integrations.


<hr style="border: 0.05px solid blue;">

# Integration Service

The `IntegrationService` is responsible for handling integrations associated with a Smooch App. It utilizes the `SmoochAPI` for communication with the Smooch API.

## Constructor

### `constructor(smoochApiClient: SmoochAPI)`

- `smoochApiClient`: An instance of the `SmoochAPI` used for making requests to the Smooch API.

## Methods

### `async refreshIntegrations(): Promise<any[]>`

This method fetches and returns a list of integrations associated with the Smooch App.

#### Returns

- A Promise resolving to an array of integrations.

## Error Handling

- If there is an error fetching integrations, an `Error` is thrown with the message "Error fetching integrations."

## Usage

1. Import the `IntegrationService` and `SmoochAPI` in your project:

2. Initialize the `SmoochAPI` with the required parameters.

3. Initialize the `IntegrationService` with the `SmoochAPI` instance.

4. Use the `refreshIntegrations` method to fetch and handle integrations.

<hr style="border: 0.05px solid blue;">

# Webhooks Service

The `WebhooksService` is responsible for managing webhooks associated with a Smooch App. It utilizes the `SmoochAPI` for communication with the Smooch API.

## Constructor

### `constructor(smoochApiClient: SmoochAPI, organizationId: string, baseUrl: string)`

- `smoochApiClient`: An instance of the `SmoochAPI` used for making requests to the Smooch API.
- `organizationId`: The unique identifier of the organization to which the Smooch App belongs.
- `baseUrl`: The base URL of the application, used to construct webhook endpoints.

## Methods

### `async addWebhooks(): Promise<void>`

This method adds two types of webhooks: notification hooks and logging hooks. Notification hooks are used for handling various notification-related events, while logging hooks are used for handling message events.

## Error Handling

- If there is an error adding webhooks, a `BadRequestError` is thrown with the error message.

## Usage

1. Import the `WebhooksService` and `SmoochAPI` in your project:

2. Initialize the `SmoochAPI` with the required parameters.

3. Provide the `organizationId` and `baseUrl` when initializing the `WebhooksService`.

4. Use the `addWebhooks` method to add notification and logging webhooks.

