import { CSVTagProcessor } from "@classes/tag-processors/csv-processor";

it("successfully processes a CSV Tag", async () => {
  const tag = {
    index: 1,
    type: "csv",
    fields: "firstName",
  };

  const csvRows = [
    { index: 1, data: { mobileNumber: "1234567890", firstName: "John" } },
    {
      index: 1,
      data: { mobileNumber: "1234567891", firstName: "Jane" },
    },
  ];

  const mobileNumber = "1234567891";

  const result = await new CSVTagProcessor().processTag(tag, {
    csvRows,
    mobileNumber,
  });

  expect(result).toBeTruthy();
});
