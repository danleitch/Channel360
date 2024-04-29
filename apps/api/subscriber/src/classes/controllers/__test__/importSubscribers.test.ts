import fs from "fs";
import path from "path";
import { app } from "@app";
import request from "supertest";
import { Group } from "@models/group";
import { GroupSubscriber } from "@models/groupSubscriber";
import { ImportSubscribersToGroupSeeder } from "@seeders/ImportSubscribersToGroupSeeder";
import { Subscriber } from "@models/subscriber";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Importing subscribers 📜", () => {
  it("should import subscribers to a group successfully and clean up properly", async () => {
    // Seed DB
    await new ImportSubscribersToGroupSeeder().seed();

    const group = await Group.findOne();
    const orgId = group!.organization.toString();

    const csvFilePath = path.join(__dirname, "dummy_subscribers.csv");

    const response = await request(app)
      .post(`/webapi/org/${orgId}/subscribers/import/`)
      .attach("file", fs.readFileSync(csvFilePath), "dummy_subscribers.csv");

    expect(response.status).toEqual(201);

    await sleep(5000); // 5 seconds

    const subscribersInDatabase = await Subscriber.countDocuments({});

    expect(subscribersInDatabase).toBe(5);
  });

  it("SHOULD IMPORT 10 000 Subscribers in less than 30seconds successfully 🧪", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const group = await Group.findOne();

    const csvFilePath = path.join(__dirname, "mobile_numbers.csv");

    const response = await request(app)
      .post(`/v1.1/org/${group!.organization}/subscribers/import/${group!.id}`)
      .attach("file", fs.readFileSync(csvFilePath), "mobile_numbers.csv");

    expect(response.status).toEqual(201);

    // Wait for the background process to likely complete
    await sleep(30000); // 5 seconds

    expect(response.body.message).toBe(
      "Importing subscribers to the group has started"
    );

    const groupSubscriber = await GroupSubscriber.countDocuments({});

    expect(groupSubscriber).toBeGreaterThan(500);
  });

  it("SHOULD import subscribers to a group successfully 🧪", async () => {
    // Seed DB
    await new ImportSubscribersToGroupSeeder().seed();

    const group = await Group.findOne();

    const csvFilePath = path.join(__dirname, "dummy_subscribers.csv");

    const response = await request(app)
      .post(`/v1.1/org/${group!.organization}/subscribers/import/${group!.id}`)
      .attach("file", fs.readFileSync(csvFilePath), "dummy_subscribers.csv");

    expect(response.status).toEqual(201);

    // Wait for the background process to likely complete
    await sleep(5000); // 5 seconds

    expect(response.body.message).toBe(
      "Importing subscribers to the group has started"
    );
    const subscribersInDatabase = await Subscriber.countDocuments({});

    expect(subscribersInDatabase).toBe(5);
  });
});
