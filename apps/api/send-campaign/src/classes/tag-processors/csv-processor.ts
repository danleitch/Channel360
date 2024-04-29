import { Parameter, TemplateTag } from "@channel360/core";
import { ITagProcessor, TagProcessingContext } from "@classes/TagTransformer";
import { findCSVParsedToJson, lookUpCSVField } from "@helpers/csv-helpers";

export class CSVTagProcessor implements ITagProcessor {
  isApplicable(tag: TemplateTag): boolean {
    return tag.type === "csv";
  }

  async processTag(
    tag: TemplateTag,
    { csvRows, mobileNumber }: TagProcessingContext,
  ): Promise<Parameter> {
    let csvForLookup;

    /**
     * If Tag is a Button Tag
     * Then Tag Index should be the index in the Array
     */

    const isButtonTag = !tag.index;
    if (isButtonTag) {
      csvRows = csvRows!.map((row) => {
        return {
          ...row,
          index: 0,
        };
      });

      csvForLookup = findCSVParsedToJson(csvRows, 0);
    } else {
      if ("index" in tag && csvRows !== undefined) {
        csvForLookup = findCSVParsedToJson(csvRows, tag.index!);
      }
    }
    // Ensure csvRows is defined before attempting to use it

    // Ensure csvForLookup and mobileNumber are defined before calling lookUpCSVField
    const replacementText =
      csvForLookup && mobileNumber
        ? await lookUpCSVField(csvForLookup, mobileNumber, tag.fields!)
        : ""; // Provide a fallback value or handle the undefined case as appropriate

    return {
      type: "text",
      text: replacementText,
    };
  }
}
