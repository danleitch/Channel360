import { Parameter, TemplateTag } from "@channel360/core";
import { CSVTagProcessor } from "@classes/tag-processors/csv-processor";
import { VideoTagProcessor } from "@classes/tag-processors/video-processor";
import { ImageTagProcessor } from "@classes/tag-processors/image-processor";
import { DocumentTagProcessor } from "@classes/tag-processors/document-processor";
import { HardCodedTagProcessor } from "@classes/tag-processors/hard-coded-processor";
import { SubscriberFieldTagProcessor } from "@classes/tag-processors/subscriber-field-processor";
import { OnCampaignCreationTagProcessor } from "@classes/tag-processors/on-campaign-creation-processor";

export interface ITagProcessor {
  isApplicable(tag: TemplateTag): boolean;

  processTag(
    tag: TemplateTag,
    context: TagProcessingContext,
  ): Promise<Parameter>;
}

export interface TagProcessingContext {
  csvRows?: { index: number; data: any }[];
  mobileNumber?: string;
  recipient?: any;
}

class TagTransformer {
  private processors: ITagProcessor[];

  constructor() {
    this.processors = [
      new CSVTagProcessor(),
      new VideoTagProcessor(),
      new ImageTagProcessor(),
      new DocumentTagProcessor(),
      new HardCodedTagProcessor(),
      new SubscriberFieldTagProcessor(),
      new OnCampaignCreationTagProcessor(),
    ];
  }

  async transformTagsToParameters(
    tags: TemplateTag[],
    csvRows: any,
    mobileNumber: string,
    recipient: any,
  ): Promise<Parameter[]> {
    const context = { csvRows, mobileNumber, recipient };

    return Promise.all(tags.map((tag) => this.processTag(tag, context)));
  }

  private async processTag(
    tag: TemplateTag,
    context: TagProcessingContext,
  ): Promise<Parameter> {
    const processor = this.processors.find((p) => p.isApplicable(tag));

    if (!processor) {
      throw new Error(`Unsupported tag type: ${tag.type}`);
    }

    return processor.processTag(tag, context);
  }
}

export default TagTransformer;
