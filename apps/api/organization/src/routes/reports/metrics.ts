import { Request, Response, Router } from "express";
import { Organization } from "@models/organization";
import { User } from "@models/user";

const router = Router({ mergeParams: true });

router.use(async (_: Request, res: Response) => {
  const users = await User.find();

  const organizations = await Organization.find().populate("plan");

  const report = {
    usersCount: users.length,
    organizationsCount: organizations.length,
    organizations,
  };

  res.send(report);
});

export { router as indexOrganizationReportRouter };
