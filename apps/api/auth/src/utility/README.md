# Create Ethereal Account

This document provides information on the creation of Ethereal email accounts for testing purposes in the Channel360 platform.

## Overview
- **Library Used:** `nodemailer`
- **Purpose:** Creating Ethereal email accounts for testing and development.

## Functionality
The `createEtherealAccount` function creates an Ethereal email account using the `nodemailer` library. Ethereal is a service that provides fake SMTP servers for testing email functionality without sending real emails.

<hr style="border: 0.05px solid blue;">

# Email Testing Utilities

This document outlines utility functions for testing email functionality in the Channel360 platform. These utilities leverage the `imapflow` and `mailparser` libraries to connect to an Ethereal mailbox, retrieve the last email, and parse its content.

## Overview
- **Libraries Used:**
  - `imapflow`: An IMAP client library for Node.js.
  - `mailparser`: A library for parsing email content.
- **Purpose:** Testing email-related functionality using an Ethereal mailbox.

## `connectToMailbox` Function
This function establishes a connection to an Ethereal mailbox using the provided username (email) and password.

## `parseEmail` Function
This function parses the content of the provided email source.

## `lastEmail` Function (Main Utility)
This function combines the previous functions to retrieve and parse the last received email from the mailbox.


