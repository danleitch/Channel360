/**
 * Generate recipient based component
 * This function will generate the component based on the recipient fields
 * @param campaignTags
 * @param components
 * @param mobileNumber
 * @param headerCsvRows
 * @param bodyCsvRows
 * @param recipient
 */
import TagTransformer from "@classes/TagTransformer";
import { ParameterComponent, TemplateTag } from "@channel360/core";

export async function generateComponentForRecipient(
  tags: TemplateTag[],
  type: "HEADER" | "BODY" | "BUTTON" | "FOOTER",
  mobileNumber: string,
  csvRows: any[],
  recipient: any,
): Promise<ParameterComponent> {
  let finalComponent: ParameterComponent = {
    type,
    parameters: [],
  };
  let parameters;

  switch (type) {
    case "HEADER":
      parameters = await new TagTransformer().transformTagsToParameters(
        tags,
        csvRows,
        mobileNumber,
        recipient,
      );

      finalComponent = {
        type,
        parameters,
      };
      break;
    case "BODY":
      parameters = await new TagTransformer().transformTagsToParameters(
        tags,
        csvRows,
        mobileNumber,
        recipient,
      );
      finalComponent = {
        type,
        parameters,
      };
      break;
    case "BUTTON":
      parameters = await new TagTransformer().transformTagsToParameters(
        tags,
        csvRows,
        mobileNumber,
        recipient,
      );
      finalComponent = {
        type,
        sub_type: "url",
        index: 0,
        parameters,
      };
      break;
    case "FOOTER":
      break;

    default:
      finalComponent = {
        type,
        parameters: [],
      };
      break;
  }
  return finalComponent;
}
