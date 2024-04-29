import { Parameter, TemplateTag } from "@channel360/core";
import { ITagProcessor, TagProcessingContext } from "@classes/TagTransformer";
import { lookUpSubscriberField } from "@helpers/lookUpSubscriberField";

export class SubscriberFieldTagProcessor implements ITagProcessor {
  isApplicable(tag: TemplateTag): boolean {
    return tag.type === "subscriber-field";
  }

  async processTag(
    tag: TemplateTag,
    { recipient }: TagProcessingContext,
  ): Promise<Parameter> {
    const replacementText = await lookUpSubscriberField(recipient, tag.fields);

    return {
      type: "text",
      text: replacementText,
    };
  }
}
