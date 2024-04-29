import TagTransformer from "@classes/TagTransformer";
import { TemplateTag } from "@channel360/core";
import mongoose from "mongoose";

it("transforms tags to parameters", async () => {
  const tags: TemplateTag[] = [
    {
      index: 1,
      type: "csv",
      fields: "firstName",
    },
  ];

  const mobileNumber: string = "27656225667";
  const csvRows = [
    { index: 1, data: { mobileNumber: "27656225667", firstName: "John" } },
    {
      index: 1,
      data: { mobileNumber: "1234567891", firstName: "Jane" },
    },
  ];
  const recipient = new mongoose.Types.ObjectId().toString();

  const result = await new TagTransformer().transformTagsToParameters(
    tags,
    csvRows,
    mobileNumber,
    recipient,
  );

  expect(result[0].text).toEqual("John");
});
