#  Emailer 

The `Emailer` class is an abstract class designed to facilitate sending emails using the Nodemailer library. It serves as a base class for specific email types, such as `AddUserEmail`, `InviteEmail`, etc. These specific email classes extend the `Emailer` class and provide the necessary data for generating and sending emails.

## Usage

To use the `Emailer` class, create a specific email class that extends it. In the specific email class, implement the `replacements` and `options` properties with the required data for the email. The `html` property should contain the HTML template for the email.

## `Emailer` Class

### Properties

- `html` (string): The HTML template for the email.
- `transporter` (object): The Nodemailer transport object.

### Methods

- `buildTransport`: Creates and returns a Nodemailer transport object.
- `send`: Sends the email using the configured transporter and email options.

## Error Handling

Any errors that occur during the email sending process are logged to the console. Error handling specific to your application can be added as needed.

Note: Make sure to set the `SENDGRID_API_KEY` environment variable before using the `Emailer` class, as it is required for authentication.

<hr style="border: 0.05px solid blue;">

# Read HTML File Utility

The `readHTMLFile` utility function is designed to read the content of an HTML file asynchronously using the `fs` module's `readFile` method.

In this example, the `readHTMLFile` function is imported and used to read the content of an HTML file specified by the `path` variable. The function returns a `Promise` that resolves to the content of the HTML file.

## Parameters

- `path` (string): The file path of the HTML file to be read.

## Returns

A `Promise` that resolves to the content of the HTML file.

## Error Handling

If an error occurs during the file reading process, the function logs an error message to the console and throws an error with the message "Failed to read email template." The calling code can catch this error and handle it appropriately.

