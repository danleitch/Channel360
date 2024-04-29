import csv from "csvtojson";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import { TemplateTag } from "../utilities/TemplateTagValidator";


dotenv.config({ path: ".env.local" });

const s3 = new AWS.S3({
  region: "af-south-1",
  credentials: {
    accessKeyId: process.env["AWS_ACCESS_KEY_ID"]!,
    secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"]!,
  },
});

/**
 * lookUpCsvField
 * finds the field in the json object (converted csv data) by mobileNumber
 * @param data - the converted CSV Data
 * @param mobileNumber - the number of the recipient
 * @param field - the look-up field
 */
export const lookUpCSVField = async (
  data: any[],
  mobileNumber: string,
  field: string,
) => {
  const row = await data.find((row: any) => {
    return Object.values(row)[0] === mobileNumber;
  });

  if (!row) {
    return null;
  }

  return row[field];
};
export const fetchCsvFromS3 = async (objectKey: string): Promise<any[]> => {
  const params = {
    Bucket: "channel360-template-tags",
    Key: objectKey,
  };

  const stream = s3.getObject(params).createReadStream();
  return csv({ delimiter: [";", ","] }).fromStream(stream);
};

/**
 * processCSVTags
 * - fetches csv from S3 Bucket
 * - formats each mobile number to remove any '+' prefix
 * @param csvTags - the head or body csv tags
 * @return csvRows - all the csv rows for either head or body csv tag
 */

export const processCSVTags = async (csvTags: TemplateTag[]) => {
  let csvRows: any[] = [];

  for (const tag of csvTags) {
    if (tag?.url) {
      const allRowsInCsv = await fetchCsvFromS3(tag.url);

      allRowsInCsv.forEach((row) => {
        const mobileNumber =
          typeof row.mobileNumber === "string"
            ? row.mobileNumber.replace("+", "")
            : "";

        csvRows.push({
          index: tag.index,
          //@ts-ignore
          data: { ...row, mobileNumber },
        });
      });
    }
  }

  return csvRows;
};

/**
 * findCsvParsedToJson
 * extracts the data from the csv files that match the tag index
 * @param CSVFiles
 * @param index
 */
export function findCSVParsedToJson(
  CSVFiles: { data: any; index: number }[],
  index: number,
) {
  return CSVFiles.filter((CSV: any) => CSV.index === index).map(
    (CSV: any) => CSV.data,
  );
}
