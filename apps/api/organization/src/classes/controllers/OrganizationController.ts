import {
  CreateSuccess,
  DeleteSuccess,
  GetSuccess,
  UpdateSuccess,
} from "@channel360/core";
import { Request, Response } from "express";
import { natsWrapper } from "../../nats-wrapper";
import { IController } from "@interfaces/IController";
import { IOrganization } from "@interfaces/IOrganization";
import { CreateGroupController } from "@controllers/GroupControllers";
import OrganizationRepository from "@repositories/OrganizationRepository";
import { OrganizationCreatedPublisher } from "@publishers/organization-created-publisher";
import { OrganizationUpdatedPublisher } from "@publishers/organization-updated-publisher";

export class OrganizationController implements IController<IOrganization> {
  /**
   * Creates an Organization
   * @param req
   * @param res
   */
  async create(req: Request, res: Response) {
    const { name, planId } = req.body;

    const organization = await OrganizationRepository.create({
      name,
      plan: planId,
    });

    await new CreateGroupController(
      organization.id,
      "Group for " + name,
    ).createGroup();

    await new OrganizationCreatedPublisher(natsWrapper.client).publish({
      id: organization.id,
      name: organization.name,
      users: organization.users,
      version: organization.version,
    });

    return new CreateSuccess(res).send("Campaign created successfully");
  }

  /**
   * Deletes an organization
   * @param req
   * @param res
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    await OrganizationRepository.delete(id);
    return new DeleteSuccess(res).send("Organization created successfully");
  }

  /**
   * Returns an organization
   * @param req
   * @param res
   */
  async get(req: Request, res: Response): Promise<Response<IOrganization>> {
    const { orgId } = req.params;

    const organization = await OrganizationRepository.get(orgId);
    return new GetSuccess(res).send(organization);
  }

  /**
   * Returns a list of organizations
   * @param _req
   * @param res
   */
  async list(_req: Request, res: Response): Promise<Response<IOrganization>> {

    const organizations = await OrganizationRepository.list();

    return new GetSuccess(res).send(organizations);
  }

  /**
   * Updates an organization
   * @param req
   * @param res
   */
  async update(req: Request, res: Response): Promise<Response> {
    const { orgId } = req.params;

    const updateFields = req.body;

    const organization = await OrganizationRepository.update(orgId, updateFields);

    await new OrganizationUpdatedPublisher(natsWrapper.client).publish({
      id: organization.id,
      name: organization.name,
      users: organization.users,
      settings: organization.settings,
      version: organization.version,
    });


    return new UpdateSuccess(res).send(
      "Organization updated successfully",
      organization,
    );
  }
}

export default new OrganizationController();
