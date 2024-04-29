import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Organization, OrganizationDoc } from "@models/organization";

jest.setTimeout(30000);

jest.mock("../nats-wrapper");

let mongo: any;
declare global {
  var createOrganization: () => Promise<OrganizationDoc>;
}
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

global.createOrganization = async () => {
  const organization = Organization.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: "TestOrganization",
    users: [],
    settings: new mongoose.Types.ObjectId().toHexString(),
  });

  await organization.save();

  return organization;
};
