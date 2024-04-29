import { TemplateTagValidator } from "../TemplateTagValidator";

describe("Validating csv tag type 📜", () => {
  it("should return success when validating csv tags 🧪", async () => {
    const tags = {
      body: [
        {
          index: 1,
          type: "csv",
          fields: "Name",
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
  it("should return an error when csv scheme is incorrect 🧪", async () => {
    const tags = {
      body: [
        {
          index: 1,
          type: "csv",
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
