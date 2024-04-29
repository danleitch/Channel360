import { Request, Response, Router } from "express";
import { Organization } from "@models/organization";
import {
  BadRequestError,
  EmailSubjects,
  ModelFinder
} from "@channel360/core";
import { User } from "@models/user";
import { Role } from "@models/role";
import { OrganizationRoleUser } from "@models/organizationRoleUser";
import { OrganizationUpdatedPublisher } from "@publishers/organization-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { EmailPublisher } from "@publishers/email-publisher";
import { UnassignGroupController } from "@controllers/GroupControllers";

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

  if (!organization.users.includes(user.id)) {
    throw new BadRequestError("User not in organization");
  }

  // Remove the user from the organization
  organization.users = organization.users.filter(
    (id) => id.toString() !== user.id
  );
  await organization.save();

  // Remove the user's role from the organization
  const role = await ModelFinder.findOneOrFail(
    Role,
    { name: "user" },
    "Role not found"
  );

  await OrganizationRoleUser.deleteOne({
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

  await new UnassignGroupController(user.cognitoId, orgId)
    .unassignUserToGroup()
    .catch((err: any) => {
      throw new BadRequestError(err.message);
    });

  await new EmailPublisher(natsWrapper.client).publish({
    emailType: EmailSubjects.UserRemoved,
    name: user.firstName,
    organizationId: organization.id,
    organizationName: organization.name,
    toEmail: user.email,
  });

  res.status(200).send({
    message: "User removed from organization successfully",
  });
});

export { router as removeUserFromOrganizationRouter };
