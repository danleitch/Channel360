import { TemplateTag, ValidationResult } from "./TemplateTagValidator";
export abstract class TagValidator {
  abstract validate(tag: TemplateTag): ValidationResult;
}
export class CsvTagValidator extends TagValidator {
  validate(tag: TemplateTag): ValidationResult {
    const errors: string[] = [];
    let validTemplate = true;

    if (!tag.fields || tag.fields.trim() === "") {
      errors.push("csv fields required");
      validTemplate = false;
    }

    return { validTemplate, errors };
  }
}

export class HardCodedTagValidator extends TagValidator {
  validate(tag: TemplateTag): ValidationResult {
    const errors: string[] = [];
    let validTemplate = true;

    if (!tag.value || tag.value.trim() === "") {
      errors.push("hard-coded value required");
      validTemplate = false;
    }
    return { validTemplate, errors };
  }
}

export class OnCampaignCreationTagValidator extends TagValidator {
  validate(tag: TemplateTag): ValidationResult {
    const errors: string[] = [];
    let validTemplate = true;

    if (!tag.value || tag.value.trim() === "") {
      errors.push("on-campaign-creation prompt required");
      validTemplate = false;
    }

    return { validTemplate, errors };
  }
}

export class ImageTagValidator extends TagValidator {
  validate(tag: TemplateTag): ValidationResult {
    const errors: string[] = [];
    let validTemplate = true;

    if (!tag.url || tag.url.trim() === "") {
      errors.push("image url required");
      validTemplate = false;
    }

    return { validTemplate, errors };
  }
}

export class FileTagValidator extends TagValidator {
  validate(tag: TemplateTag): ValidationResult {
    const errors: string[] = [];
    let validTemplate = true;

    if (!tag.document || tag.document.link.trim() === "") {
      errors.push("file url required");
      validTemplate = false;
    }

    return { validTemplate, errors };
  }
}

export class VideoTagValidator extends TagValidator {
  validate(tag: TemplateTag): ValidationResult {
    const errors: string[] = [];
    let validTemplate = true;

    if (!tag.url || tag.url.trim() === "") {
      errors.push("video url required");
      validTemplate = false;
    }

    return { validTemplate, errors };
  }
}

export class SubscriberFieldValidator extends TagValidator {
  validate(tag: TemplateTag): ValidationResult {
    const errors: string[] = [];
    let validTemplate = true;

    if (!tag.fields || tag.fields.trim() === "") {
      errors.push("subscriber-field fields required");
      validTemplate = false;
    }

    return { validTemplate, errors };
  }
}