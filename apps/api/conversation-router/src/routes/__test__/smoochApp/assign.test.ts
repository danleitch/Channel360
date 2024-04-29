import request from "supertest";
import { app } from "@app";
import { SmoochApp } from "@models/smoochApp";
import mongoose from "mongoose";
import { NextFunction } from "express";

jest.mock("@services/index", () => {
  return {
    ...jest.requireActual("@services/index"), // Use the actual module for other exports
    WebhooksService: jest.fn().mockImplementation(() => ({
      addWebhooks: jest.fn().mockResolvedValue({}),
    })),
    IntegrationService: jest.fn().mockImplementation(() => ({
      refreshIntegrations: jest.fn().mockResolvedValue([
        {
          _id: "test_id",
          type: "whatsapp",
        },
      ]),
    })),
  };
});

jest.mock("@channel360/core", () => {
  return {
    ...jest.requireActual("@channel360/core"),
    validateCognitoToken: (_req: Request, _res: Response, next: NextFunction) =>
      next(),
    requireAdminGroup: (_req: Request, _res: Response, next: NextFunction) =>
      next(),
    validateCognitoTokenAndOrganization: (
      _req: Request,
      _res: Response,
      next: NextFunction,
    ) => next(),
    SmoochAPI: jest.fn().mockImplementation(() => {
      return {
        makeGetRequest: jest.fn().mockImplementation(() => {
          // Mocked response
          return Promise.resolve({
            status: 200,
            data: {
              app: {
                _id: "test_id",
                name: "Test App",
                appToken: new mongoose.Types.ObjectId().toHexString(),
                settings: {},
              },
            },
          });
        }),
      };
    }),
  };
});
describe("smoochApp/assign", () => {
  it("should assign a smooch app to an organization", async () => {
    // Sign in as Admin
    // Get the Org Id
    const { id: MOCK_ORG_ID } = await global.createOrganization();

    const MOCK_APP_ID = "test_id";

    const res = await request(app)
      .post(`/webapi/org/${MOCK_ORG_ID}/whatsapp/smooch/${MOCK_APP_ID}`)
      .send()
      .expect(201);

    expect(res.body.appId).toEqual(MOCK_APP_ID);
    expect(res.body.name).toEqual("Test App");
  });

  it("should assign an organization, if the smooch app exists but does not have an organization assigned", async () => {
    // Get the Org Id
    const { id: MOCK_ORG_ID } = await global.createOrganization();

    // Create a Smooch App
    const MOCK_APP_ID = "test_id";
    const MOCK_APP_NAME = "Test App";

    const smoochApp = SmoochApp.build({
      appId: MOCK_APP_ID,
      name: MOCK_APP_NAME,
    });

    await smoochApp.save();

    // Assign the Smooch App to the Organization
    const res = await request(app)
      .post(`/webapi/org/${MOCK_ORG_ID}/whatsapp/smooch/${MOCK_APP_ID}`)
      .send()
      .expect(200);

    expect(res.body.appId).toEqual(MOCK_APP_ID);
    expect(res.body.name).toEqual(MOCK_APP_NAME);
    expect(res.body.organization).toEqual(MOCK_ORG_ID.toString());
  });

  it("should return 400 if the smooch app is already assigned", async () => {
    // Get the Org Id
    const { id: MOCK_ORG_ID } = await global.createOrganization();

    // Create a Smooch App
    const MOCK_APP_ID = "test_id";
    const MOCK_APP_NAME = "Test App";

    const smoochApp = SmoochApp.build({
      appId: MOCK_APP_ID,
      name: MOCK_APP_NAME,
      organization: MOCK_ORG_ID,
    });

    await smoochApp.save();

    const res = await request(app)
      .post(`/webapi/org/${MOCK_ORG_ID}/whatsapp/smooch/${MOCK_APP_ID}`)
      .send()
      .expect(400);

    expect(res.body.errors[0].message).toEqual(
      "Smooch App already assigned to an organization",
    );
  });
});
