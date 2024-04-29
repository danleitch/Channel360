#  App 

This document provides an overview of the setup for an Express application. The application includes routing for both legacy and new APIs related to logging, using Express middleware and error handling.

## Technologies Used

- __Express:__ A fast, unopinionated, minimalist web framework for Node.js.
- __express-async-errors:__ Middleware to catch asynchronous errors in Express applications.
- __body-parser:__ Middleware to parse incoming request bodies.
- __cookie-session:__ Middleware for handling session cookies.
- __cors:__ Middleware for enabling Cross-Origin Resource Sharing (CORS).
- __channel360/core:__ Custom middleware, error handlers, and utilities for authentication and authorization.

## Application Structure

The Express application is structured to handle both legacy and new APIs related to logging. It includes routes for exporting logs (`/export`), retrieving logs (`/`), and logging messages (`/`). Additionally, the application handles both authenticated and unauthenticated requests.

### 1. Middleware Setup
- **`cors`:** Enables Cross-Origin Resource Sharing (CORS) to allow requests from different origins.
- **`trust proxy`:** Configures the app to trust the proxy headers, which is important when the app is deployed behind a proxy (e.g., Nginx).
- **`json`:** Parses incoming JSON request bodies.
- **`cookie-session`:** Handles session cookies for user authentication.

### 2. Legacy API Setup
- **`apiRouter`:** Handles routes related to the legacy API.
- **`currentAdmin` and `currentUser`:** Middleware for extracting information about the current admin and user from the request.
- Routes include `/export` for exporting logs, `''` (root) for retrieving logs, and `''` (root) for logging messages.

### 3. New WebAPI Setup

- **`webApiRouter`:** Handles routes related to the new WebAPI..
- Uses `validateCognitoTokenAndOrganization` middleware for authentication and organization validation.

### 4. Error Handling and Catch-All Route
- The catch-all route (`'*'`) throws a `NotFoundError` for any unmatched routes.
- The `errorHandler` middleware is used to handle errors and send appropriate responses.

## Running the Application

To run the application, use the following command:

```bash
npm start
```

This will start the Express server, and the application will be accessible at the specified port. Adjust the port and other configurations as needed for your environment.


