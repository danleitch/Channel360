# Group Controllers

This document provides an overview of the Cognito API controllers used in the Channel360 application, including their purpose, usage, and how to interact with Amazon Cognito to create and manage user groups.

The Cognito API controllers are TypeScript classes that encapsulate the logic for interacting with Amazon Cognito's Identity and Access Management (IAM) service. These controllers are designed to create, assign, and unassign user groups within a Cognito User Pool.

## CreateGroupController

The `CreateGroupController` class is responsible for creating a new user group in the Cognito User Pool. It extends the `CognitoAPIProvider` class, which handles authentication with the Cognito service.

### Parameters

- `groupName`: The name of the group to be created.
- `description`: A description of the group.

### Method

- `createGroup()`: Asynchronously creates the user group using the provided parameters.

## AssignGroupController

The `AssignGroupController` class is responsible for assigning a user to a specified user group in the Cognito User Pool. It also extends the `CognitoAPIProvider` class.

### Parameters

- `cognitoId`: The Cognito user ID.
- `groupName`: The name of the group to which the user will be assigned.

### Method

- `assignUserToGroup()`: Asynchronously assigns the specified user to the specified group.

## UnassignGroupController

The `UnassignGroupController` class is responsible for unassigning a user from a specified user group in the Cognito User Pool. It extends the `CognitoAPIProvider` class.

### Parameters

- `cognitoId`: The Cognito user ID.
- `groupName`: The name of the group from which the user will be unassigned.

### Method

- `unassignUserToGroup()`: Asynchronously unassigns the specified user from the specified group.

## Usage

To use these controllers, instantiate them with the required parameters and call the respective methods.

## Environment Variables

Ensure the following environment variable is set for the controllers to interact with the correct Cognito User Pool:

- `AWS_COGNITO_POOL_ID`: The ID of the Cognito User Pool.

