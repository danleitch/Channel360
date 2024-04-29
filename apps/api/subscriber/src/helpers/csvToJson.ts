import csv from "csvtojson";
import { Readable } from "stream";

export const csvToJson = async (fileBuffer: Buffer) => {
  return csv().fromStream(Readable.from(fileBuffer));
};
