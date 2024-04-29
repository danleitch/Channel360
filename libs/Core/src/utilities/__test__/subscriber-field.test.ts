import { TemplateTagValidator } from "../TemplateTagValidator";

describe("Validating subscriber-field tag type 📜", () => {
  it("should return success when validating csv tags 🧪", async () => {
    const tags = {
      body: [
        {
          index: 1,
          type: "subscriber-field",
          fields: "firstName",
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
  it("should return an error when subscriber-field scheme is incorrect 🧪", async () => {
    const tags = {
      body: [
        {
          index: 1,
          type: "subscriber-field",
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
