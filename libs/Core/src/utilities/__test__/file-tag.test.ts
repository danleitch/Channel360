import { TemplateTagValidator } from "../TemplateTagValidator";

describe("Validating file tag type 📜", () => {
  it("should return success when validating file tags 🧪", async () => {
    const tags = {
      body: [],
      head: [
        {
          type: "document",
          document:{
            link: "https://channel360-template-tags.s3.af-south-1.amazonaws.com/2024-01-30T06%3A28%3A24.894Z-headerImage.pdf",
            filename: "Example PDF"
          }
        },
      ],
    };

    const templateValidator = new TemplateTagValidator();

    const { validTemplate, errors } =
      templateValidator.validateTemplateTags(tags);

    expect(validTemplate).toBeTruthy();
    expect(errors).toHaveLength(0);
  });
  it("should return an error when file scheme is incorrect 🧪", async () => {
    const tags = {
      body: [
        {
          index: 1,
          type: "document",
          value: "Tag",
        },
      ],
      head: [],
    };

    const templateValidator = new TemplateTagValidator();

    const { validTemplate, errors } =
      templateValidator.validateTemplateTags(tags);

    expect(validTemplate).toBeFalsy();
    expect(errors).toHaveLength(1);
  });
});
