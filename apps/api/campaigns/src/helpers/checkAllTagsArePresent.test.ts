import { BadRequestError } from "@channel360/core";
import { checkAllTagsArePresent } from "./checkAllTagsArePresent";

describe("checkAllTagsArePresent function", () => {
  it("should not throw an error if head and body tags match in length", () => {
    const templateTags = {
      head: [{ type: "text", value: "Hello" }],
      body: [{ type: "text", value: "World" }],
    };
    const campaignTags = {
      head: [{ type: "text", value: "Hello" }],
      body: [{ type: "text", value: "World" }],
    };

    expect(() =>
      checkAllTagsArePresent(templateTags, campaignTags)
    ).not.toThrow();
  });

  it("should throw an error if head tags do not match in length", () => {
    const templateTags = {
      head: [
        { type: "text", value: "Hello" },
        { type: "text", value: "There" },
      ],
      body: [{ type: "text", value: "World" }],
    };
    const campaignTags = {
      head: [{ type: "text", value: "Hello" }],
      body: [{ type: "text", value: "World" }],
    };

    expect(() => checkAllTagsArePresent(templateTags, campaignTags)).toThrow(
      BadRequestError
    );
    expect(() => checkAllTagsArePresent(templateTags, campaignTags)).toThrow(
      "Please provide all head tags associated with the template"
    );
  });

  it("should throw an error if body tags do not match in length", () => {
    const templateTags = {
      head: [{ type: "text", value: "Hello" }],
      body: [
        { type: "text", value: "World" },
        { type: "text", value: "!" },
      ],
    };
    const campaignTags = {
      head: [{ type: "text", value: "Hello" }],
      body: [{ type: "text", value: "World" }],
    };

    expect(() => checkAllTagsArePresent(templateTags, campaignTags)).toThrow(
      BadRequestError
    );
    expect(() => checkAllTagsArePresent(templateTags, campaignTags)).toThrow(
      "Please provide all body tags associated with the template"
    );
  });

  // Add more tests here as needed
});
