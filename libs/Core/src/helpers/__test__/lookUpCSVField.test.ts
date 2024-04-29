import { lookUpCSVField } from "@helpers/csv";

describe("lookUpCSVField", () => {
  it("should return null if the mobile number is not found", async () => {
    const csvData = [
      {
        mobileNumber: "27724660301",
        firstName: "John",
        lastName: "Doe",
      },
      {
        mobileNumber: "27656225667",
        firstName: "John",
        lastName: "Doe",
      },
    ];

    const mobileNumber = "27724660304";

    const fieldName = "firstName";

    const result = await lookUpCSVField(csvData, mobileNumber, fieldName);

    expect(result).toBeNull();
  });

  it("should return the first name if the mobile number is found", async () => {
    const csvData = [
      {
        mobileNumber: "27724660301",
        firstName: "John",
        lastName: "Doe",
      },
      {
        mobileNumber: "27656225667",
        firstName: "John",
        lastName: "Doe",
      },
    ];

    const mobileNumber = "27724660301";

    const fieldName = "firstName";

    const result = await lookUpCSVField(csvData, mobileNumber, fieldName);

    expect(result).toEqual("John");
  });
});
