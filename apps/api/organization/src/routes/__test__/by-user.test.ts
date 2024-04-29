import request from "supertest";
import { app } from "app";

describe("Getting Organizations by user 📜", () => {
  it("should return 200 when getting organizations by user 🧪", async () => {
      const user = await global.createUser();
      const organization = await global.createOrganization();
      await global.createUserRole();

      organization.users = [...organization.users, user.id];
      await organization.save();

      const response = await request(app)
        .get(`/webapi/users/${user.id}/organization`)
        .send();

      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(1);
  });
})