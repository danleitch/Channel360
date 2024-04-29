import { app } from "@app";
import request from "supertest";
import { Group } from "@models/group";
import { ImportSubscribersToGroupSeeder } from "@seeders/ImportSubscribersToGroupSeeder";

it("fetches a group with memberCount", async () => {
  await new ImportSubscribersToGroupSeeder().seed();

  const group = await Group.findOne();

  const response = await request(app)
    .get(`/v1.1/org/${group!.organization}/groups/${group!.id}`)
    .expect(200);
  expect(response.body.data).toBeDefined();
});
