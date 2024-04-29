import { TemplateTagValidator } from "../TemplateTagValidator";

describe("Using TemplateTagValidator to validate tags", () => {
  it("SHOULD return an error when passing invalid tags", async () => {
    const tags = {
      head: [
        {
          index: 1,
          type: "badTag",
          fields: "AcceptURL",
          url: "2023-06-13T12:18:53.193Z-import.csv",
        },
      ],
      body: [
        {
          "index": 1,
          "type": "csv",
          "fields": "AcceptURL",
          "url": "2023-06-13T12:18:53.193Z-import.csv"
        }
      ],
    };

    const tagValidator = new TemplateTagValidator();

    const { validTemplate, errors } = tagValidator.validateTemplateTags(tags);

    expect(validTemplate).toEqual(false);
    expect(errors.length).toBeGreaterThan(0);
  });
  it("SHOULD return true when passing buttons as tags", async () => {
    const tags = {
      buttons: [
        {
          sub_type: "url",
          buttonIndex: 1,
          type: "hard-coded",
          value: "123",
        },
      ],
    };

    const tagValidator = new TemplateTagValidator();

    const { validTemplate } = tagValidator.validateTemplateTags(tags);

    expect(validTemplate).toEqual(true);
  });
});
