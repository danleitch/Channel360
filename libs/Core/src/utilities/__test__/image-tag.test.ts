import { TemplateTagValidator } from "../TemplateTagValidator";

describe("Validating image tag type 📜", () => {
  it("should return success when validating csv tags 🧪", async () => {
    const tags = {
      body: [],
      head: [
        {
          type: "image",
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
  it("should return an error when image scheme is incorrect 🧪", async () => {
    const tags = {
      body: [],
      head: [
        {
          type: "image",
          value: "Tag",
        },
      ],
    };

    const templateValidator = new TemplateTagValidator();

    const { validTemplate, errors } =
      templateValidator.validateTemplateTags(tags);

    expect(validTemplate).toBeFalsy();
    expect(errors).toHaveLength(1);
  });
});
