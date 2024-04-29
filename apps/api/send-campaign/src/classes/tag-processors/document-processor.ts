import { Parameter, TemplateTag } from "@channel360/core";
import { ITagProcessor } from "@classes/TagTransformer";

export class DocumentTagProcessor implements ITagProcessor {
  isApplicable(tag: TemplateTag): boolean {
    return tag.type === "document";
  }

  async processTag(tag: TemplateTag): Promise<Parameter> {
    return {
      type: "document",
      document: {
        link: tag.document!.link,
        filename: tag.document!.filename,
      },
    };
  }
}
