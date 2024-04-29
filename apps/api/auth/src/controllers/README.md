# Forgot Password
The `ForgotPasswordController` is responsible for handling the forgot password functionality using the Cognito service.

## Usage
To use the `ForgotPasswordController`, you need to instantiate it with an email address and then call the `forgotPassword` method.

## Constructor
The `new ForgotPasswordController(email: string)`, creates an instance of the `ForgotPasswordController` with the specified email address.

### Parameters:
- __`email` (string):__ The email address for which the forgot password request will be initiated.

## Properties
- __`PARAMS: object`__: An object containing parameters required for the forgot password request. It includes the Cognito client ID, username (email), and secret hash.

## Methods
#### `forgotPassword(): Promise<any>`
Initiates the forgot password process by calling the Cognito forgotPassword method.


#### Returns:
A Promise that resolves with the response data upon a successful request or rejects with an error in case of failure.

### Configuration
Ensure that the following environment variable is set before using the `ForgotPasswordController`:

- `AWS_COGNITO_CLIENT_ID`: The Cognito client ID used for authentication.

### Dependencies
This controller depends on the <span style="color: green;">@channel360/core</span> package for the `CognitoAPIProvider` base class.

<hr style="border: 0.05px solid blue;">

# Group Controller
The `GroupController` is responsible for managing user groups using the Cognito service.

## Usage
To use the `GroupController`, you need to generate it with a Cognito user ID and a group name. After instantiation, call the `assignUserToGroup` method to assign a user to a specific group.

## Constructor
The `new GroupController(cognitoId: string, groupName: string)` creates an instance of the `GroupController` with the specified Cognito user ID and group name.

### Parameters
- __`cognitoId` (string):__ The Cognito user ID for the user to be assigned to the group.
- __`groupName` (string):__ The name of the group to which the user will be assigned.

## Properties
- __`PARAMS: object`__: An object containing parameters required for assigning a user to a group. It includes the Cognito user pool ID, Cognito user ID (Username), and the name of the group.

## Methods
### `assignUserToGroup(): Promise<any>`
Initiates the process of assigning a user to a group by calling the Cognito `adminAddUserToGroup` method.

#### Returns
A Promise that resolves with the response data upon a successful request or rejects with an error in case of failure.

### Configuration
Ensure that the following environment variable is set before using the `GroupController`:

- `AWS_COGNITO_POOL_ID`: The Cognito user pool ID used for user management.

### Dependencies
This controller depends on the <span style="color: green;">@channel360/core</span> package for the `CognitoAPIProvider` base class.

<hr style="border: 0.05px solid blue;">

# Refresh Token 

The `RefreshTokenController` is responsible for refreshing authentication tokens using the Cognito service.

## Usage
To use the `RefreshTokenController`, you need to instantiate it with a user ID and a refresh token. After instantiation, call the `requestRefreshToken` method to obtain refreshed authentication tokens.

## Constructor
The `new RefreshTokenController(userId: string, refreshToken: string)` creates an instance of the `RefreshTokenController` with the specified user ID and refresh token.

### Parameters
- __`userId` (string):__ The user ID for which the refresh token will be used.
- __`refreshToken` (string):__ The refresh token obtained from a previous authentication.

## Properties
- __`PARAMS: object`__: An object containing parameters required for the refresh token request. It includes the authentication flow type, Cognito client ID, and authentication parameters.

## Methods
### `requestRefreshToken(): Promise<any>`
Initiates the process of refreshing authentication tokens by calling the Cognito `initiateAuth` method with the `REFRESH_TOKEN_AUTH` flow.

#### Returns
A Promise that resolves with the refreshed authentication result upon a successful request or rejects with an error in case of failure.

### Configuration
Ensure that the following environment variables are set before using the `RefreshTokenController`:

- `AWS_COGNITO_CLIENT_ID`: The Cognito client ID used for authentication.

### Dependencies
This controller depends on the <span style="color: green;">@channel360/core</span> package for the `CognitoAPIProvider` base class.

<hr style="border: 0.05px solid blue;">

# Resend Verification (OTP)

The `UserResendVerificationController` is responsible for resending the verification code for user confirmation using the Cognito service.

## Usage
To use the `UserResendVerificationController`, you need to instantiate it with a user email address and then call the `resendOTP` method.

## Constructor
The `new UserResendVerificationController(email: string)` creates an instance of the `UserResendVerificationController` with the specified email address.

### Parameters
- __`email` (string):__ The email address for which the verification code will be resent.

## Properties
- __`PARAMS: object`__: An object containing parameters required for resending the verification code. It includes the Cognito user pool ID, Cognito client ID, username (email), and secret hash.

## Methods
### `resendOTP(): Promise<any>`
Initiates the process of resending the verification code by calling the Cognito `resendConfirmationCode` method.

#### Returns
A Promise that resolves with the response data upon a successful request or rejects with an error in case of failure.

### Configuration
Ensure that the following environment variables are set before using the `UserResendVerificationController`:

- `AWS_COGNITO_USER_POOL_ID`: The Cognito user pool ID used for user management.
- `AWS_COGNITO_CLIENT_ID`: The Cognito client ID used for authentication.

### Dependencies
This controller depends on the <span style="color: green;">@channel360/core</span> for the `CognitoAPIProvider` base class.

<hr style="border: 0.05px solid blue;">

# Reset Password

The `ResetPasswordController` is responsible for resetting a user's password using the Cognito service.

## Usage
To use the `ResetPasswordController`, you need to instantiate it with a user email address, the confirmation code received, and the new password. After instantiation, call the `resetPassword` method to confirm the forgot password request and set the new password.

## Constructor
The `new ResetPasswordController(email: string, code: string, newPassword: string)` creates an instance of the `ResetPasswordController` with the specified email address, confirmation code, and new password.

### Parameters
- __`email` (string):__ The email address associated with the user account.
- __`code` (string):__ The confirmation code received by the user.
- __`newPassword` (string):__ The new password to set for the user account.

## Properties
- __`PARAMS: object`__: An object containing parameters required for resetting the password. It includes the Cognito client ID, username (email), confirmation code, new password, and secret hash.

## Methods
### `resetPassword(): Promise<any>`
Initiates the process of resetting the password by calling the Cognito `confirmForgotPassword` method.

#### Returns
A Promise that resolves with the response data upon a successful request or rejects with an error in case of failure.

### Configuration
Ensure that the following environment variables are set before using the `ResetPasswordController`:

- `AWS_COGNITO_CLIENT_ID`: The Cognito client ID used for authentication.

### Dependencies
This controller depends on the <span style="color: green;">@channel360/core</span> package for the `CognitoAPIProvider` base class. 

<hr style="border: 0.05px solid blue;">

# Sign-In

The `UserSignInController` is responsible for authenticating a user using the Cognito service.

## Usage
To use the `UserSignInController`, you need to instantiate it with a user email address and password. After instantiation, call the `signIn` method to initiate the user authentication.

## Constructor
The `new UserSignInController(email: string, password: string)` creates an instance of the `UserSignInController` with the specified user email and password.

### Parameters
- __`email` (string):__ The email address associated with the user account.
- __`password` (string):__ The password for the user account.

## Properties
- __`PARAMS: object`__: An object containing parameters required for user authentication. It includes the authentication flow type, Cognito client ID, and authentication parameters.

## Methods
### `signIn(): Promise<any>`
Initiates the process of user authentication by calling the Cognito `initiateAuth` method with the `USER_PASSWORD_AUTH` flow.

#### Returns
A Promise that resolves with the authentication result upon a successful request or rejects with an error in case of failure.

### Configuration
Ensure that the following environment variables are set before using the `UserSignInController`:

- `AWS_COGNITO_CLIENT_ID`: The Cognito client ID used for authentication.

### Dependencies
This controller depends on the <span style="color: green;">@channel360/core</span> package for the `CognitoAPIProvider` base class.

<hr style="border: 0.05px solid blue;">

# Sign-Out (global)

The `UserSignOutController` is responsible for signing out a user from all devices using the Cognito service.

## Usage
To use the `UserSignOutController`, you need to instantiate it with a valid access token. After instantiation, call the `signOut` method to sign out the user from all devices.

## Constructor
The `new UserSignOutController(accessToken: string)` creates an instance of the `UserSignOutController` with the specified access token.

### Parameters
- __`accessToken` (string):__ The access token associated with the user's session.

## Properties
- __`PARAMS: object`__: An object containing parameters required for signing out the user. It includes the access token.

## Methods
### `signOut(): Promise<any>`
Initiates the process of signing out the user from all devices by calling the Cognito `globalSignOut` method.

#### Returns
A Promise that resolves upon successful sign-out or rejects with an error in case of failure.

### Dependencies
This controller depends on the  <span style="color: green;">@channel360/core</span> for the `CognitoAPIProvider` base class.

<hr style="border: 0.05px solid blue;">

# Sign-Up

The `UserSignUpController` is responsible for registering a new user using the Cognito service and saving the user information to the database.

## Usage
To use the `UserSignUpController`, you need to instantiate it with a user document (UserDoc) and then call the `signUp` method.

## Constructor
The `new UserSignUpController(user: UserDoc)` creates an instance of the `UserSignUpController` with the specified user document.

### Parameters
- __`user` (UserDoc):__ The user document containing information about the user to be registered.

## Properties
- __`PARAMS: object`__: An object containing parameters required for user registration. It includes the Cognito client ID, username (email), password, user attributes (such as email, given_name, family_name, and phone_number), and secret hash.

## Methods
### `signUp(): Promise<any>`
Initiates the process of user registration by calling the Cognito `signUp` method. It also saves the user information to the database and emits a `UserCreatedEvent`.

#### Returns
A Promise that resolves with the registration data upon a successful request or rejects with an error in case of failure.

### Dependencies
This controller depends on the <span style="color: green;">@channel360/core</span> package for the `CognitoAPIProvider` base class. It also interacts with the <span style="color: green;">@models/user</span> model for saving user information to the database and the <span style="color: green;">@publishers/user-created-publisher</span> for emitting the `UserCreatedEvent`.

<hr style="border: 0.05px solid blue;">

# Verify Account

The `VerifyAccountController` is responsible for confirming a user's account by verifying the provided one-time password (OTP) using the Cognito service.

## Usage
To use the `VerifyAccountController`, you need to instantiate it with a user email address and the OTP received during the signup process. After instantiation, call the `verifyAccount` method.

## Constructor
The `new VerifyAccountController(email: string, otp: string)` creates an instance of the `VerifyAccountController` with the specified email address and OTP.

### Parameters
- __`email` (string):__ The email address associated with the user account.
- __`otp` (string):__ The one-time password (OTP) received during the signup process.

## Properties
- __`PARAMS: object`__: An object containing parameters required for verifying the user's account. It includes the Cognito client ID, username (email), confirmation code (OTP), and secret hash.

## Methods
### `verifyAccount(): Promise<any>`
Initiates the process of verifying the user's account by calling the Cognito `confirmSignUp` method.

#### Returns
A Promise that resolves with the response data upon a successful request or rejects with an error in case of failure.

### Configuration
Ensure that the following environment variables are set before using the `VerifyAccountController`:

- `AWS_COGNITO_CLIENT_ID`: The Cognito client ID used for authentication.

### Dependencies
This controller depends on the <span style="color: green;">@channel360/core</span>  package for the `CognitoAPIProvider` base class.

<hr style="border: 0.05px solid blue;">








