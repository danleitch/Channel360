# Validation Middleware README

This document provides information about the validation middleware used in the Channel360 application.

Validation middleware is crucial for ensuring that incoming requests meet the required criteria and constraints. In the Channel360 application, validation middleware is implemented using the `express-validator` library. This README provides details about the specific validation middleware for organization-related routes.

## Validation Middleware

### REQUIRE_ORGANIZATION

The `REQUIRE_ORGANIZATION` middleware is designed for routes that require the `orgId` parameter to be present and not empty. It uses the `express-validator` library to perform this validation.

## Usage

To use the `REQUIRE_ORGANIZATION` middleware, import it into the respective route file and include it in the route definition. 

By including `REQUIRE_ORGANIZATION` in the middleware stack for a specific route, you ensure that the `orgId` parameter is validated before the route logic is executed.

