import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";

jest.mock("../nats-wrapper.ts");
jest.mock("@channel360/core", () => ({
  ...jest.requireActual("@channel360/core"),
  validateCognitoToken: (_req: Request, _res: Response, next: NextFunction) =>
    next(),
  validateAPIKey: (_req: Request, _res: Response, next: NextFunction) => next(),
  requireAuth: (_req: Request, _res: Response, next: NextFunction) => next(),
  requireOrg: () => (_req: Request, _res: Response, next: NextFunction) =>
    next(),
  validateCognitoTokenAndOrganization: (
    _req: Request,
    _res: Response,
    next: NextFunction
  ) => next(),
}));
jest.setTimeout(60000);

let mongo: MongoMemoryServer;
declare global {
  /* eslint-disable */
  var signin: () => Promise<{ id: string; token: string }>;
  /* eslint-disable */
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

  for (const collection of collections) {
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

  return { id: id, token: userJwt };
};
