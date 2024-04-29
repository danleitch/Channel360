import SubscriberRepository from "@repositories/SubscriberRepository";
import { ImportSubscribersToGroupSeeder } from "@seeders/ImportSubscribersToGroupSeeder";
import { Subscriber } from "@models/subscriber";
import * as fs from "fs";
import * as path from "path";
import { Organization } from "@models/organization";

describe("Importing subscribers 📜", () => {
  it("should import subscribers", async () => {
    await new ImportSubscribersToGroupSeeder().seed();
    const organization = await Organization.findOne();
    const orgId = organization!.id;

    const csvFilePath = path.join(__dirname, "dummy_subscribers.csv");

    const csvFileBuffer = fs.readFileSync(csvFilePath) as Buffer;

    await SubscriberRepository.importSubscribers(orgId, csvFileBuffer);

    const importedSubscribers = await Subscriber.find();

    expect(importedSubscribers[1].firstName).toBe("Jane");
    expect(importedSubscribers[1].lastName).toBe("Smith");
    expect(importedSubscribers[1].mobileNumber).toBe("+2710000000");
    expect(importedSubscribers[2].firstName).toBe("Sarah");
    expect(importedSubscribers[2].lastName).toBe("Garcia");
    expect(importedSubscribers[2].mobileNumber).toBe("+27133243954");
  });
});
