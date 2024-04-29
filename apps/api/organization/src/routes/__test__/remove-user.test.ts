import request from "supertest";
import { UnassignGroupController } from "@controllers/GroupControllers";
import { NextFunction } from "express";
import { app } from "app";
import { Organization } from "@models/organization";

jest.mock("../../nats-wrapper");
jest.mock("@controllers/GroupControllers");
jest.mock("@channel360/core", () => ({
  ...jest.requireActual("@channel360/core"),
  validateCognitoToken: (_req: Request, _res: Response, next: NextFunction) =>
    next(),
  requireAdminGroup: (_req: Request, _res: Response, next: NextFunction) =>
    next(),
}));

describe("Un-assigning a user from an organization 📜", () => {
  it("should return 200 when removing a user from an organization🧪", async () => {
    /**
     * Create a user, organization and user role
     */
    const user = await global.createUser();
    const organization = await global.createOrganization();
    await global.createUserRole();

    /**
     * Add the user to the organization
     */

    organization.users = [...organization.users, user.id];
    await organization.save();

    UnassignGroupController.prototype.unassignUserToGroup = jest
      .fn()
      .mockResolvedValue(null);

    /**
     * Perform the request
     */

    const response = await request(app)
      .delete(`/webapi/admin/organization/${organization.id}/users/${user.id}`)
      .send();

    /**
     * Assert the response
     */
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual("User removed from organization successfully");

    /**
     * Validate that the organization has no assigned users.
     */

    const updatedOrganization = await Organization.findById(organization.id);

    expect(updatedOrganization?.users.length).toEqual(0);
  });
});
