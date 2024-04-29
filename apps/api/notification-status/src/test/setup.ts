import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {Organization, OrganizationDoc} from "@models/organization";

jest.mock("../nats-wrapper.ts");
let mongo: any;
declare global {
  var signin: () => Promise<{ id:string,token:string }>;
  var createOrganization: (userId:{ id:string }) => Promise<OrganizationDoc>;
}
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  process.env.NODE_ENV = "test";
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const userJwt = jwt.sign(
      {
        id,
        firstName: "test",
        lastName: "testLastName",
        username: "testuser",
        email: "test@test.com",
      },
      process.env.JWT_KEY!
  );

  return {id:id, token: userJwt};
};

global.createOrganization = async(user: { id:string }) => {
    const organization = Organization.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        name: "TestOrganization",
        users: [user.id],
        settings: new mongoose.Types.ObjectId().toHexString()
    })

    await organization.save();

    return organization;
}
