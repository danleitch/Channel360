import { Parameter, TemplateTag } from "@channel360/core";
import { ITagProcessor } from "@classes/TagTransformer";

export class HardCodedTagProcessor implements ITagProcessor {
  isApplicable(tag: TemplateTag): boolean {
    return tag.type === "hard-coded";
  }

  async processTag(tag: TemplateTag): Promise<Parameter> {
    return {
      type: "text",
      text: tag.value,
    };
  }
}
