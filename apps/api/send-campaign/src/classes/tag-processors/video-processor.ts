import { Parameter, TemplateTag } from "@channel360/core";
import { ITagProcessor } from "@classes/TagTransformer";

export class VideoTagProcessor implements ITagProcessor {
  isApplicable(tag: TemplateTag): boolean {
    return tag.type === "video";
  }

  async processTag(tag: TemplateTag): Promise<Parameter> {
    return {
      type: "video",
      video: {
        link: tag.url,
      },
    };
  }
}
