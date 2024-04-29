import { findCSVParsedToJson } from "@helpers/csv";

it("finds the field in a an array of csv objects", async () => {
  const csvRows = [
    { index: 1, data: { mobileNumber: "1234567890", firstName: "John" } },
    {
      index: 1,
      data: { mobileNumber: "1234567891", firstName: "Jane" },
    },
  ];

  const index = 1;

  const result = await findCSVParsedToJson(csvRows, index);

  expect(result.length).toEqual(2);
  expect(result[0].mobileNumber).toBe("1234567890");
  expect(result[1].mobileNumber).toBe("1234567891");
});
