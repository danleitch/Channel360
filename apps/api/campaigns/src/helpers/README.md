# Component Factory

The `ParameterBuilder` class is a utility class for building an array of parameters used in a messaging system. Each parameter is represented by an object with a specified type and additional properties.

## Methods:
### `addText(text: string): ParameterBuilder`
Adds a text parameter to the builder.

#### Parameters:
- `text`: A string representing the text value.

#### Returns:
- Returns the `ParameterBuilder` instance for method chaining.

### `addImage(link: string): ParameterBuilder`
Adds an image parameter to the builder.

#### Parameters:
- `link`: A string representing the link to the image.

#### Returns:
- Returns the `ParameterBuilder` instance for method chaining.

### `addDocument(link: string, filename: string): ParameterBuilder`
Adds a document parameter to the builder.

#### Parameters:
- `link`: A string representing the link to the document.
- `filename`: A string representing the filename of the document.

#### Returns:
- Returns the `ParameterBuilder` instance for method chaining.

### `build(): Parameter[]`
Builds and returns an array of parameters.

#### Returns:
- An array of `Parameter` objects representing the built parameters.

## Usage:
Instantiate the `ParameterBuilder` class to create an instance of the builder. Use the provided methods to add different types of parameters, and then call the `build()` method to obtain the final array of parameters.

<hr style="border: 0.05px solid blue;">

# CSV Service

This utility provides functions for looking up values in CSV files, converting CSV to JSON, and processing CSV tags.

## Functions:
### `lookUpCSVField(csv: any, firstColumnLookUpValue: string, field: string): Promise<any>`
Looks up a specific field value in a CSV based on the value in the first column.

#### Parameters:
- `csv`: The CSV data.
- `firstColumnLookUpValue`: The value to look up in the first column.
- `field`: The field whose value needs to be retrieved.

#### Returns:
- A `Promise` that resolves to the value of the specified field.

### `csvToJSON(objectKey: string): Promise<any>`
Converts a CSV file stored in an AWS S3 bucket to JSON.

#### Parameters:
- `objectKey`: The key of the CSV file in the S3 bucket.

#### Returns:
- A `Promise` that resolves to an array of JSON objects representing the CSV data.

### `processCSVTags(csvTags: any[], csvFiles: any[]): void`
Processes an array of CSV tags, converting each tagged CSV file to JSON and storing the result in an array.

#### Parameters:
- `csvTags`: An array of tags containing information about CSV files.
- `csvFiles`: An array to store processed CSV files.

<hr style="border: 0.05px solid blue;">

# Index  

This utility provides functions for looking up values in CSV files, converting CSV to JSON, and handling CSV files.

## Functions:
### `lookUpCSVField(csv: any, firstColumnLookUpValue: string, field: string): Promise<any>`
Looks up a specific field value in a CSV based on the value in the first column.

#### Parameters:
- `csv`: The CSV data.
- `firstColumnLookUpValue`: The value to look up in the first column.
- `field`: The field whose value needs to be retrieved.

#### Returns:
- A `Promise` that resolves to the value of the specified field.

### `lookUpSubscriberField(subscriber: any, field: any): any`
Looks up a field value in a subscriber object.

#### Parameters:
- `subscriber`: The subscriber object.
- `field`: The field whose value needs to be retrieved.

#### Returns:
- The value of the specified field in the subscriber object.

### `findCSVParsedToJson(CSVFiles: any, index: any): any`
Finds a specific CSV file in an array and returns its parsed JSON data.

#### Parameters:
- `CSVFiles`: An array of objects containing CSV data and associated indices.
- `index`: The index of the CSV file to retrieve.

#### Returns:
- The parsed JSON data of the specified CSV file.

### `csvToJSON(objectKey: string): Promise<any>`
Converts a CSV file stored in an AWS S3 bucket to JSON.

#### Parameters:
- `objectKey`: The key of the CSV file in the S3 bucket.

#### Returns:
- A `Promise` that resolves to an array of JSON objects representing the CSV data.

<hr style="border: 0.05px solid blue;">

# S3Service AWS

This AWS service singleton provides a single instance of the AWS S3 service using the AWS SDK.

## Class: `AWSService`
### Methods:
#### `getInstance(): AWSService`
Returns the singleton instance of the `AWSService`.

#### `getS3(): AWS.S3`
Returns the AWS S3 service instance.

<hr style="border: 0.05px solid blue;">

# Tag To Params

This utility provides a function to transform tags into parameters based on different types.

## Function: `transformTagsToParameters`
### Description:
Transforms tags into parameters based on their type. Supports various tag types, including CSV lookup, hard-coded values, on-campaign-creation values, images, documents, and subscriber fields.

### Parameters:
- `tags: any`: An array of tags to be transformed.
- `csvFiles: any`: An array of CSV files used for CSV lookup.
- `mobileNumber: string`: The mobile number for CSV lookup.
- `subscriber: any`: Subscriber data for subscriber field lookup.

### Returns:
A Promise that resolves to an array of transformed parameters.

<hr style="border: 0.05px solid blue;">
