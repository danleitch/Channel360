import {
  CsvTagValidator,
  FileTagValidator,
  HardCodedTagValidator,
  ImageTagValidator,
  OnCampaignCreationTagValidator,
  SubscriberFieldValidator,
  TagValidator,
  VideoTagValidator,
} from "./template-tag-definitions";

interface BaseTag {
  type: string;
  fields?: string;
  value?: string;
  url?: string;
}

export interface TemplateTag extends BaseTag {
  index?: number;
  document?: {
    link: string;
    filename: string;
  };
}

export interface Tag {
  head?: TemplateTag[];
  body?: TemplateTag[];
  buttons?: BaseTag[];
}

export interface ValidationResult {
  validTemplate: boolean;
  errors: string[];
}

class TagValidatorFactory {
  static getValidator(tag: TemplateTag): TagValidator {
    switch (tag.type) {
      case "csv":
        return new CsvTagValidator();
      case "hard-coded":
        return new HardCodedTagValidator();
      case "on-campaign-creation":
        return new OnCampaignCreationTagValidator();
      case "subscriber-field":
        return new SubscriberFieldValidator();
      case "image":
        return new ImageTagValidator();
      case "document":
        return new FileTagValidator();
      case "video":
        return new VideoTagValidator();
      // ... other cases for different tag types
      default:
        return {
          validate(_tag: TemplateTag): ValidationResult {
            return { validTemplate: false, errors: ["Invalid tag type"] };
          },
        };
    }
  }
}

export class TemplateTagValidator {
  constructor() {}

  validateTemplateTags(templateTags: Tag): ValidationResult {
    let validTemplate = true;
    const errors: string[] = [];

    if (!templateTags.head && !templateTags.body && !templateTags.buttons) {
      return {
        validTemplate: false,
        errors: ["No valid tag types"],
      };
    }

    const evaluateTemplateSection = (tags: TemplateTag[]) => {
      tags?.forEach((tag) => {
        if (!tag.type) {
          errors.push(
            "tag type not provided for tag! All tags must specify a type.",
          );
          validTemplate = false;
          return;
        }

        try {
          const validator = TagValidatorFactory.getValidator(tag);
          const result = validator.validate(tag);
          validTemplate = validTemplate && result.validTemplate;
          errors.push(...result.errors);
        } catch (error) {
          errors.push(`Error validating tag: ${(error as Error).message}`);
          validTemplate = false;
        }
      });
    };

    if (templateTags.head && templateTags.head.length > 0) {
      evaluateTemplateSection(templateTags.head);
    }
    if (templateTags.body && templateTags.body.length > 0) {
      evaluateTemplateSection(templateTags.body);
    }
    if (templateTags.buttons && templateTags.buttons.length > 0) {
      evaluateTemplateSection(templateTags.buttons);
    }

    return { validTemplate, errors };
  }
}
