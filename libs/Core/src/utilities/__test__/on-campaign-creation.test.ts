import { TemplateTagValidator } from "../TemplateTagValidator";

describe("Validating on-campaign-creation tag type 📜", () => {
  it("should return success when validating on-campaign-creation tags 🧪", async () => {
    const tags = {
      body: [
        {
          index: 1,
          type: "on-campaign-creation",
          value: "Name",
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
  it("should return an error when on-campaign-creation scheme is incorrect 🧪", async () => {
    const tags = {
      body: [
        {
          index: 1,
          type: "on-campaign-creation",
          fields: "Name",
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
