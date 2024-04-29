# Agenda Configuration

The `agenda` module is responsible for configuring the **Agenda** job scheduling library. It establishes connections to the MongoDB database and defines various job types for handling different tasks, such as sending campaigns and synchronizing templates.

## Overview

The module uses the `Agenda` library to create an instance of the scheduler, connecting it to the specified MongoDB database. It then combines multiple sets of job definitions, including `campaignDefinitions` and `templateDefinitions`, to cover various aspects of job scheduling.

## Usage

To use the `agenda` module, follow these steps:

1. Import the necessary modules and dependencies.
2. Create an instance of the `Agenda` scheduler, providing the MongoDB connection details.
3. Combine multiple sets of job definitions using the `allDefinitions` function.
4. Start processing jobs by calling `agenda.start()`.

## Dependencies

This module assumes the existence of specific job definition modules (`campaignDefinitions` and `templateDefinitions`). Ensure that these modules are correctly implemented and available in your project.

### `allDefinitions`

The `allDefinitions` function combines multiple sets of job definitions into a single set for use with the `Agenda` scheduler.

## Contributing

Contributions to enhance and improve the `agenda` module are welcome. Feel free to create issues or submit pull requests.

