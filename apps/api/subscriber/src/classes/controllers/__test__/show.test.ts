import { ImportSubscribersToGroupSeeder } from "@seeders/ImportSubscribersToGroupSeeder";
import request from "supertest";
import { app } from "@app";
import { Group } from "@models/group";

it("fetches a list of groups with memberCount", async () => {
  await new ImportSubscribersToGroupSeeder().seed();

  const group = await Group.findOne();

  const response = await request(app)
    .get(
      `/v1.1/org/${
        group!.organization
      }/groups?page=1&limit=5&withMemberCount=true`
    )
    .expect(200);

  expect(response.body.totalDocuments).toEqual(1);
  const groupSubscriberCount = await Group.countDocuments({});
  expect(groupSubscriberCount).toBeGreaterThan(0);
});
