import { BadRequestError, Tag } from "@channel360/core";

export const checkAllTagsArePresent = (
  templateTags: Tag,
  campaignTags: Tag
) => {
  /**
   * TODO: Filter out Image tags from head and body
   */
  if (
    (templateTags.head?.length ?? 0) > 0 &&
    templateTags.head?.length != campaignTags.head?.length
  ) {
    throw new BadRequestError(
      "Please provide all head tags associated with the template"
    );
  }
  if (
    (templateTags.body?.length ?? 0)> 0 &&
    templateTags.body?.length != campaignTags.body?.length
  ) {
    throw new BadRequestError(
      "Please provide all body tags associated with the template"
    );
  }
};
