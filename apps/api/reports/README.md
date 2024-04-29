# App

The main application file for the Channel360 Notification Service (`app.ts`) sets up the Express application, configures middleware, and defines routes for handling various aspects of the service. Below is an overview of the key components:

## 1. Express Application Configuration

The application is created using `express` and configured with necessary middleware.

## 2. API Router Configuration

The application defines an API router (`apiRouter`) and adds routes related to reports for administrators and organizations.

## 3. Web API Router Configuration

The application also defines a Web API router (`webApiRouter`) and adds a route for handling web API reports.

## 4. Error Handling

The application includes a wildcard route to handle any undefined routes, throwing a `NotFoundError`.

## 5. Export Application

The configured Express application is exported for use in other parts of the application.

This application setup allows handling API requests related to reports from both administrators and organizations. It segregates routes based on their functionalities and ensures proper error handling throughout the application.

<hr style="border: 0.05px solid blue;">

# Index

The Channel360 Notification Service is a microservice designed to handle notifications and reports for administrators and organizations. The service is built using Node.js, Express, MongoDB for data storage, and NATS for communication.

## Getting Started

To run the Channel360 Notification Service, follow these steps:

### Prerequisites

Make sure you have the following prerequisites installed on your system:

- Node.js
- npm (Node Package Manager)
- MongoDB
- NATS (NATS Streaming Server)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   cd channel360-notification-service
   npm install
   ```

3. Set environment variables:

   Create a `.env` file in the root directory with the following variables:

   ```env
   JWT_KEY=<your-jwt-key>
   MONGO_URI=<your-mongo-uri>
   NATS_URL=<your-nats-url>
   NATS_CLIENT_ID=<your-nats-client-id>
   ```

### Running the Service

Start the Channel360 Notification Service:

```bash
npm start
```

The service will be running on port 3000.

## Service Structure

The service is structured as follows:

- **app.ts**: Main application file, configuring Express and defining routes.
- **routes**: Contains route handlers for different functionalities.
- **models**: Defines MongoDB schemas and models.
- **nats-wrapper.ts**: Handles NATS connection and JetStream setup.
- **middleware**: Custom middleware functions.
- **errorHandlers**: Error handling middleware.
- **utils**: Utility functions.

## Features

- **Web API Reports**: Generates reports for organizations via a web API.
- **Admin Reports**: Provides reports for administrators.
- **Notification Metrics**: Retrieves and exports notification metrics.

## Technologies Used

- Node.js
- Express
- MongoDB
- NATS
- json2csv

## Contributing

Feel free to contribute to the development of the Channel360 Notification Service. Create issues, submit pull requests, and provide feedback.

