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
            app: {
              _id: "test_id",
              name: "Test App",
              appToken: new mongoose.Types.ObjectId().toHexString(),
              settings: {},
            },
          });
        }),
      };
    }),
  };
});

describe("smoochApp/unassign", () => {
  it("should unassigned a smooch app from an organization", async () => {
    // Get the Org Id
    const { id: MOCK_ORG_ID } = await global.createOrganization();

    // Create a Smooch App
    const smoochApp = SmoochApp.build({
      appId: "test_id",
      name: "Test App",
      organization: MOCK_ORG_ID,
    });

    await smoochApp.save();

    const MOCK_APP_ID = "test_id";

    const res = await request(app)
      .delete(`/webapi/org/${MOCK_ORG_ID}/whatsapp/smooch/${MOCK_APP_ID}`)
      .expect(202);

    expect(res.body.message).toEqual("Smooch App has been unassigned");
  });

  it("should return 400 when trying to un-assign a smooch app to an organization that is already assigned to another organization", async () => {
    // Get the Org Id
    const { id: MOCK_ORG_ID } = await global.createOrganization();

    // Create a Smooch App
    const smoochApp = SmoochApp.build({
      appId: "test_id",
      name: "Test App",
      organization: new mongoose.Types.ObjectId().toHexString(),
    });

    await smoochApp.save();

    const MOCK_APP_ID = "test_id";

    const res = await request(app)
      .delete(`/webapi/org/${MOCK_ORG_ID}/whatsapp/smooch/${MOCK_APP_ID}`)
      .expect(400);

    expect(res.body.errors[0].message).toEqual(
      "Smooch App already assigned to another organization",
    );
  });
});
