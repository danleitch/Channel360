import {
  BadRequestError,
  EmailSubjects,
  ModelFinder,
} from "@channel360/core";
import { User } from "@models/user";
import { Role } from "@models/role";
import { Organization } from "@models/organization";
import { Request, Response, Router } from "express";
import { EmailPublisher } from "@publishers/email-publisher";
import { OrganizationRoleUser } from "@models/organizationRoleUser";
import { OrganizationUpdatedPublisher } from "@publishers/organization-updated-publisher";
import { AssignGroupController } from "@controllers/GroupControllers";
import { natsWrapper } from "../../nats-wrapper";

const router = Router({ mergeParams: true });
router.use(async (req: Request, res: Response) => {
  // legacy, todo: remove req.body
  const { orgId: bodyOrgId, userId: bodyUserId } = req.body;
  const { orgId: paramOrgId, userId: paramUserId } = req.params;

  const orgId = bodyOrgId || paramOrgId;
  const userId = bodyUserId || paramUserId;

  const organization = await ModelFinder.findByIdOrFail(
    Organization,
    orgId,
    "Organization not found"
  );

  const user = await ModelFinder.findByIdOrFail(User, userId, "User not found");

  if (organization.users.includes(user.id)) {
    throw new BadRequestError("User already in organization");
  }
  organization.users = [...organization.users, user.id];

  const role = await ModelFinder.findOneOrFail(
    Role,
    { name: "user" },
    "Role not found"
  );

  const organizationRoleUser = OrganizationRoleUser.build({
    organization: organization.id,
    user: user.id,
    role: role.id!,
  });

  await new OrganizationUpdatedPublisher(natsWrapper.client).publish({
    id: organization.id,
    name: organization.name,
    users: organization.users,
    version: organization.version,
  });

  await new AssignGroupController(user.cognitoId, orgId)
    .assignUserToGroup()
    .catch((err: any) => {
      throw new BadRequestError(err.message);
    });

  await organizationRoleUser.save();

  await organization.save();

  await new EmailPublisher(natsWrapper.client).publish({
    emailType: EmailSubjects.UserAdded,
    name: user.firstName,
    organizationId: organization.id,
    organizationName: organization.name,
    toEmail: user.email,
  });

  res.status(201).send({
    message: "User assigned to organization successfully",
  });
});
export { router as assignUserToOrganizationRouter };
