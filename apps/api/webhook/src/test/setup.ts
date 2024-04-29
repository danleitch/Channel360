import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Organization, OrganizationDoc } from "@models/organization";
import { NextFunction } from "express";

let mongo: any;
declare global {
  var createOrganization: () => Promise<OrganizationDoc>;
}

jest.mock("@channel360/core", () => ({
  ...jest.requireActual("@channel360/core"),
  requireAuth: (_req: Request, _res: Response, next: NextFunction) => next(),
  requireOrg:
    (_orgModel: any) => (_req: Request, _res: Response, next: NextFunction) =>
      next(),
  validateCognitoToken: (_req: Request, _res: Response, next: NextFunction) =>
    next(),
  validateAPIKey: (_req: Request, _res: Response, next: NextFunction) =>
    next(),
  validateCognitoTokenAndOrganization: (
    _req: Request,
    _res: Response,
    next: NextFunction
  ) => next(),
  requireAdminGroup: (_req: Request, _res: Response, next: NextFunction) =>
    next(),
}));

jest.setTimeout(30000);
beforeAll(async () => {
  process.env.JWT_KEY = "userjwttestkey";

  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.createOrganization = async () => {
  const organization = Organization.build({
    id: new mongoose.Types.ObjectId().toString(),
    name: "TestOrganization",
    users: [],
    settings: new mongoose.Types.ObjectId().toString()
  });

  await organization.save();

  return organization;
};
