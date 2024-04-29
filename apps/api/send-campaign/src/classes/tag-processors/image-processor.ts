import { Parameter, TemplateTag } from "@channel360/core";
import { ITagProcessor } from "@classes/TagTransformer";

export class ImageTagProcessor implements ITagProcessor {
  isApplicable(tag: TemplateTag): boolean {
    return tag.type === "image";
  }

  async processTag(tag: TemplateTag): Promise<Parameter> {
    return {
      type: "image",
      image: {
        link: tag.url,
      },
    };
  }
}
