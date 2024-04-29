import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { BadRequestError } from "../errors/bad-request-error";

/**
 * @deprecated
 * @param Organization
 */
export const requireOrg =
  (Organization: any) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const organization = await Organization.findById(req.params.orgId);
    if (!organization) {
      throw new BadRequestError("Organization not found");
    }
    // does user exist in organization?
    if (!organization.users.includes(req.currentUser?.id)) {
      throw new NotAuthorizedError();
    }
    next();
  };
