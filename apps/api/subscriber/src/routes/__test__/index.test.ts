import { app } from "@app";
import request from "supertest";
import { Organization } from "@models/organization";
import { ImportSubscribersToGroupSeeder } from "../../test/seeders/ImportSubscribersToGroupSeeder";

it("search subscribers by mobileNumber", async () => {
  await new ImportSubscribersToGroupSeeder().seed();

  const organization = await Organization.findOne();

  const response = await request(app)
    .get(`/v1.1/org/${organization!.id}/subscribers?search=27142199053`)
    .expect(200);

  expect(response.body.data[0]!.mobileNumber).toEqual("+27142199053");
  expect(response.body.data[0]!.firstName).toEqual("John");
  expect(response.body!.totalDocuments).toBe(1);
});
