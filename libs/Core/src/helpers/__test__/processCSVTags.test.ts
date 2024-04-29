import { processCSVTags } from "@helpers/csv";
import { TemplateTag } from "../../utilities/TemplateTagValidator";

describe("processCSVTags", () => {
  it("should process csv tags with no errors", async () => {
    const csvTags: TemplateTag[] = [
      {
        index: 1,
        type: "csv",
        fields: "firstName",
        url: "2024-02-17T14:29:44.194Z-CSV (1).csv"
      }
    ];

    const result = await processCSVTags(csvTags);

    expect(result.length).toEqual(2);
  });
});
