import { TemplateTag } from "@channel360/core";
import { generateComponentForRecipient } from "@helpers/generateComponentsForRecipient";

it("should generate component for recipient", async () => {
  const bodyTags: TemplateTag[] = [
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

  const recipient = "65cf59db8e4523681433200b";

  const result = await generateComponentForRecipient(
    bodyTags,
    "BODY",
    mobileNumber,
    csvRows,
    recipient,
  );

  expect(result.type).toEqual("BODY");
  expect(result.parameters);
});

it("should generate a Button component for a recipient", async () => {
  const tag: TemplateTag[] = [
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

  const recipient = "65cf59db8e4523681433200b";

  const result = await generateComponentForRecipient(
    tag,
    "BUTTON",
    mobileNumber,
    csvRows,
    recipient,
  );

  expect(result.type).toEqual("BUTTON");
  expect(result.sub_type).toEqual("url"),
  expect(result.index).toEqual(0)
  expect(result.parameters);
})