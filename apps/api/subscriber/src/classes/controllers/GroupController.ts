import {
  BadRequestError,
  CreateSuccess,
  DeleteSuccess,
  GetSuccess,
  NotFoundError,
} from "@channel360/core";
import { Request, Response } from "express";
import { natsWrapper } from "../../nats-wrapper";
import { GroupDeletedPublisher } from "@publishers/group-deleted-publisher";
import { Group, GroupDoc } from "@models/group";
import { Organization } from "@models/organization";
import GroupRepository from "@repositories/GroupRepository";
import { GroupCreatedPublisher } from "@publishers/group-created-publisher";
import { GroupUpdatedPublisher } from "@publishers/group-updated-publisher";

class GroupController {
  /**
   * Delete a Group
   * @param req
   * @param res
   */
  async deleteGroup(req: Request, res: Response) {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);

    if (!group) {
      throw new NotFoundError();
    }

    await GroupRepository.delete(groupId);

    await new GroupDeletedPublisher(natsWrapper.client).publish({
      id: group.id,
      name: group.name,
      version: group.version,
    });

    return new DeleteSuccess(res).send("Group Deleted Successfully");
  }

  /**
   * Get a Group and its count
   * @param req
   * @param res
   */
  async getGroupAndCount(req: Request, res: Response): Promise<void> {
    const { orgId, id } = req.params;

    const data = await GroupRepository.get(orgId, id);

    if (!data) {
      throw new BadRequestError("Group not found");
    }

    res.status(200).send({ data });
  }

  /**
   * Create a new Group
   * @param req
   * @param res
   */
  async createGroup(req: Request, res: Response) {
    const { description, name } = req.body;
    console.log("Received Request for Groups");

    const organization = await Organization.findById(req.params.orgId);
    if (!organization) {
      throw new BadRequestError("Organization not found");
    }
    const groupData = {
      name,
      description,
    } as GroupDoc;
    // Create a new Group
    const group = await GroupRepository.create(groupData);

    await new GroupCreatedPublisher(natsWrapper.client).publish({
      id: group.id,
      organization: organization.id,
      name,
      description,
      createdBy: group.createdBy,
      enabled: group.enabled,
      version: group.version,
    });
    return new CreateSuccess(res).send("Created Group Successfully", group);
  }

  /**
   * List all Groups
   * @param req
   * @param res
   */
  async listGroups(req: Request, res: Response): Promise<void> {
    const orgId = req.params.orgId;
    const { page, limit, search } = req.query;

    const pagination = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      search: (search as string) || "",
    };

    const { data, totalDocuments, totalPages } = await GroupRepository.list(
      orgId,
      pagination
    );
    const response = {
      data,
      totalDocuments,
      totalPages,
      currentPage: pagination.page,
    };
    new GetSuccess(res).send(response);
  }

  /**
   * Update a Group
   * @param req
   * @param res
   */
  async updateGroup(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedGroup = await GroupRepository.update(id, updatedFields);

    // Assuming GroupUpdatedPublisher and natsWrapper are properly imported
    await new GroupUpdatedPublisher(natsWrapper.client).publish({
      id: updatedGroup.id,
      name: updatedGroup.name,
      enabled: updatedGroup.enabled,
      description: updatedGroup.description,
      organization: updatedGroup.organization,
      createdBy: updatedGroup.createdBy,
      version: updatedGroup.version,
    });

    new GetSuccess(res).send(
      `Group updated successfully: ${updatedGroup.name}`
    );
  }
}

export default new GroupController();
