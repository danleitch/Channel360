import { TemplateTagValidator } from "../TemplateTagValidator";

describe("Validating hard-coded tag type 📜", () => {
  it("should return success when validating hard-coded tags 🧪", async () => {
    const tags = {
      body: [
        {
          index: 1,
          type: "hard-coded",
          value: "Tag",
        },
      ],
      head: [],
    };

    const templateValidator = new TemplateTagValidator();

    const { validTemplate, errors } =
      templateValidator.validateTemplateTags(tags);

    expect(validTemplate).toBeTruthy();
    expect(errors).toHaveLength(0);
  });
  it("should return an error when hard-coded scheme is incorrect 🧪", async () => {
    const tags = {
      body: [
        {
          index: 1,
          type: "hard-coded",
          field: "Tag",
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
