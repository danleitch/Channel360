import { TemplateTagValidator } from "../TemplateTagValidator";

describe("Validating video tag type 📜", () => {
  it("should return success when validating video tags 🧪", async () => {
    const tags = {
      body: [],
      head: [
        {
          type: "video",
          url: "https://channel360-template-tags.s3.af-south-1.amazonaws.com/2024-01-30T06%3A28%3A24.894Z-headerImage.jpg",
        },
      ],
    };

    const templateValidator = new TemplateTagValidator();

    const { validTemplate, errors } =
      templateValidator.validateTemplateTags(tags);

    expect(validTemplate).toBeTruthy();
    expect(errors).toHaveLength(0);
  });
  it("should return an error when video scheme is incorrect 🧪", async () => {
    const tags = {
      body: [
        {
          index: 1,
          type: "video",
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
