import request from "supertest";
import { app } from "@app";
import { SmoochApp } from "@models/smoochApp";
import { NextFunction } from "express";

jest.mock("@channel360/core", () => {
  return {
    ...jest.requireActual("@channel360/core"), // This line ensures other exports from the module remain unmocked
    validateCognitoTokenAndOrganization: (
      _req: Request,
      _res: Response,
      next: NextFunction,
    ) => next(),
    SmoochAPI: jest.fn().mockImplementation(() => {
      return {
        makePostRequest: jest.fn().mockImplementation(() =>
          Promise.resolve({
            status: 200,
            data: {
              messageTemplate: {
                status: "active",
                category: "MARKETING",
                id: "template_id",
              },
            },
          }),
        ),
      };
    }),
  };
});

describe("creating a template 📜", () => {
  let MOCK_ORG_ID: string;

  beforeAll(async () => {
    const { id } = await global.createOrganization();
    MOCK_ORG_ID = id;
  });

  it("SHOULD create a template successfully 🧪", async () => {
    // Create a Smooch App with orgId
    const smoochApp = SmoochApp.build({
      appId: "356asdasd",
      name: "smooch_app",
      organization: MOCK_ORG_ID,
    });

    await smoochApp.save();

    const templateData = {
      name: "test_template",
      description: "A test template description",
      namespace: "test_namespace",
      enabled: true,
      language: "en",
      category: "MARKETING",
      components: [
        {
          type: "BODY",
          parameters: [
            {
              type: "TEXT",
              text: "This is a test message",
            },
          ],
        },
      ],
    };

    const res = await request(app)
      .post(`/webapi/org/${MOCK_ORG_ID}/whatsapp/templates`)
      .send(templateData);

    expect(res.status).toEqual(201);

    expect(res.body.message).toContain(
      "Template test_template has been created successfully",
    );
  });

  it("SHOULD fail to create a template with invalid tags 🚫", async () => {
    // Create a Smooch App with orgId
    const smoochApp = SmoochApp.build({
      appId: "356asdasd",
      name: "smooch_app",
      organization: MOCK_ORG_ID,
    });

    await smoochApp.save();

    const templateData = {
      name: "test_template",
      description: "A test template description",
      namespace: "test_namespace",
      enabled: true,
      language: "en",
      category: "MARKETING",
      components: [
        {
          type: "BODY",
          parameters: [
            {
              type: "TEXT",
              text: "This is a test message",
            },
          ],
        },
      ],
    };

    const invalidTemplateData = {
      ...templateData, // Assuming templateData is defined as in the previous test
      tags: ["invalid_tag1", "invalid_tag2"], // Invalid tags
    };

    const response = await request(app)
      .post(`/webapi/org/${MOCK_ORG_ID}/whatsapp/templates`)
      .send(invalidTemplateData)
      .expect(400);

    expect(response.body.errors[0].message).toEqual(
      "No valid tag types",
    );
  });

  it("SHOULD fail when organization is not connected to Whatsapp 🚫", async () => {
    const templateData = {
      name: "Test Template",
      description: "A test template description",
      namespace: "test_namespace",
      enabled: true,
      language: "en",
      category: "MARKETING",
      components: [
        {
          type: "BODY",
          parameters: [
            {
              type: "TEXT",
              text: "This is a test message",
            },
          ],
        },
      ],
    };

    const MOCK_INVALID_ORG_ID = "invalid_org_id"; // An organization ID that does not exist or is not connected to WhatsApp

    await request(app)
      .post(`/webapi/org/${MOCK_INVALID_ORG_ID}/whatsapp/templates`)
      .send(templateData) // Assuming templateData is defined as in the first test
      .expect(400); // Expecting BadRequestError due to organization not connected to WhatsApp
  });
});
