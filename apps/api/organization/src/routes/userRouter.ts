import { getOrganizationByUserRouter } from "@routes/user/by-user";
import { Router } from "express";

const userApiRouter = Router({ mergeParams: true });

/**
 * Users
 * /webapi/users/:userId
 */

userApiRouter.get("/organization", getOrganizationByUserRouter);

export default userApiRouter