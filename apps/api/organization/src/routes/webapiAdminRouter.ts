import { Router } from "express";
import { listOrganizationRouter } from "@routes/organization/list";
import { assignUserToOrganizationRouter } from "@routes/user/assign-user";
import { removeUserFromOrganizationRouter } from "@routes/user/remove-user";
import { newOrganizationRouter } from "@routes/organization/new";
import { getOrganizationRouter } from "@routes/organization/get";
import { updateOrganizationRouter } from "@routes/organization/update";
import { deleteOrganizationRouter } from "@routes/organization/delete";

const webapiAdminRouter = Router({ mergeParams: true });

/**
 * Admin
 * webapi/admin/organization
 */

/**
 * Organization
 */
webapiAdminRouter.get("/all", listOrganizationRouter);
webapiAdminRouter.get("/:orgId", getOrganizationRouter);
webapiAdminRouter.delete("/:orgId", deleteOrganizationRouter);
webapiAdminRouter.put("/:orgId", updateOrganizationRouter);
webapiAdminRouter.post("", newOrganizationRouter);

/**
 * Users
 */
webapiAdminRouter.post("/:orgId/users/:userId", assignUserToOrganizationRouter);
webapiAdminRouter.delete(
  "/:orgId/users/:userId",
  removeUserFromOrganizationRouter,
);

export default webapiAdminRouter;
