import { Request, Response, Router } from "express";
import { Organization } from "@models/organization";
import { User } from "@models/user";
import { NotFoundError } from "@channel360/core";

const router = Router({ mergeParams: true });

router.use(async (req: Request, res: Response) => {
  // get organization by user id.

  const user = await User.findById(req.params.userId);

  if (!user) {
    throw new NotFoundError();
  }

  const organizations = await Organization.find({ users: user });

  if (!organizations) {
    throw new NotFoundError();
  }

  res.send(organizations);
});

export { router as getOrganizationByUserRouter };
