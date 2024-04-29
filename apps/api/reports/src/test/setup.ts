import { MongoMemoryServer } from "mongodb-memory-server";
import { closeDatabaseConnections, setupDatabase } from "../setup-database";

let mongo: any;

jest.setTimeout(60000);
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();
  await setupDatabase(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await closeDatabaseConnections()
  await mongo.stop();
});
