import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Organization, OrganizationDoc } from "@models/organization";
import { User, UserDoc } from "@models/user";
import { Role, RoleDoc } from "@models/role";
import { NextFunction } from "express";

let mongo: any;
declare global {
  var signin: () => { token: string };
  var createUser: () => Promise<UserDoc>;
  var createUserRole: () => Promise<RoleDoc>;
  var createOrganization: () => Promise<OrganizationDoc>;
}
jest.setTimeout(30000);

jest.mock("@channel360/core", () => ({
  ...jest.requireActual("@channel360/core"),
  validateCognitoToken: (_req: Request, _res: Response, next: NextFunction) =>
    next(),
  validateCognitoTokenAndOrganization: (
    _req: Request,
    _res: Response,
    next: NextFunction,
  ) => next(),
}));
beforeAll(async () => {
  process.env.JWT_KEY = "userjwttestkey";
  process.env.ADMIN_JWT_KEY = "adminjwttestkey";
  process.env.NODE_ENV = "test";
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

// faking Auth for testing.
global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  return { token };
};

global.createUser = async () => {
  const user = User.build({
    firstName: "test",
    lastName: "test",
    mobileNumber: "+27656225668",
    id: new mongoose.Types.ObjectId().toHexString(),
    cognitoId: new mongoose.Types.ObjectId().toHexString(),
    email: "testUser@test.com",
  });
  return await user.save();
};

global.createUserRole = async () => {
  const roleUser = Role.build({
    name: "user",
  });

  return await roleUser.save();
};

global.createOrganization = async () => {
  const organization = await Organization.build({
    name: "TestOrganization",
    plan: new mongoose.Types.ObjectId().toString(),
  });

  await organization.save();

  return organization;
};
