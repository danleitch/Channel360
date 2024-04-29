import request from "supertest";
import { AssignGroupController } from "@controllers/GroupControllers";
import { NextFunction } from "express";
import { app } from "app";

jest.mock("../../nats-wrapper");
jest.mock("@controllers/GroupControllers");
jest.mock("@channel360/core", () => ({
  ...jest.requireActual("@channel360/core"),
  validateCognitoToken: (_req: Request, _res: Response, next: NextFunction) =>
    next(),
  requireAdminGroup: (_req: Request, _res: Response, next: NextFunction) =>
    next(),
}));

describe("Assigning a user to an organization 📜", () => {
  it("returns a 400 when the user is already in the organization 🧪", async () => {
    /**
     * Create a user, organization and user role
     */
    await global.createUserRole();
    const user = await global.createUser();
    const organization = await global.createOrganization();

    /**
     * Add the user to the organization
     */

    organization.users = [...organization.users, user.id];
    await organization.save();

    AssignGroupController.prototype.assignUserToGroup = jest
      .fn()
      .mockResolvedValue(null);

    /**
     * Perform the request
     */

    const response = await request(app)
      .post(`/webapi/admin/organization/${organization.id}/users/${user.id}`)
      .send();

    /**
     * Assert the response
     */
    expect(response.status).toEqual(400);
    expect(response.body.errors[0].message).toEqual(
      "User already in organization"
    );
  });

  it("returns a 201 when assigning a user to an organization successfully 🧪", async () => {
    /**
     * Create a user, organization and user role
     */
    const user = await global.createUser();
    const organization = await global.createOrganization();
    await global.createUserRole();

    AssignGroupController.prototype.assignUserToGroup = jest
      .fn()
      .mockResolvedValue(null);

    /**
     * Perform the request
     */
    const response = await request(app)
      .post(`/webapi/admin/organization/${organization.id}/users/${user.id}`)
      .send();

    /*
     * Assert the response
     */

    expect(response.status).toEqual(201);
  });
});
