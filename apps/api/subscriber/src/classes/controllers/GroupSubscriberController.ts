import { Request, Response } from "express";
import {
  BadRequestError,
  CreateSuccess,
  DeleteSuccess,
  GetSuccess,
} from "@channel360/core";
import { Group } from "@models/group";
import GroupSubscriberRepository from "@repositories/GroupSubscriberRepository";
import SubscriberRepository from "@repositories/SubscriberRepository";
import { GroupSubscriber, GroupSubscriberDoc } from "@models/groupSubscriber";

export class SubscriberGroupsController {
  /**
   * Assign subscriber to group
   * @param req
   * @param res
   */
  async assignSubscriberToGroup(req: Request, res: Response) {
    const { subscriberIds, groupId } = req.body;

    // Get the Group
    const group = await Group.findById(groupId);

    if (!group) {
      throw new BadRequestError("Group not found");
    }

    // Get the existing group subscribers
    const existingGroupSubscribers = await GroupSubscriber.find({
      group: groupId,
    });

    // Filter out existing subscribers to optimize the creation process
    const existingSubscriberIds = existingGroupSubscribers.map((subscriber) =>
      subscriber.subscriber.toString()
    );
    const newSubscriberIds = subscriberIds.filter(
      (subscriberId: string) => !existingSubscriberIds.includes(subscriberId)
    );

    // Create GroupSubscribers for new subscribers
    const groupSubscribers = [];
    for (const subscriberId of newSubscriberIds) {
      const groupSubscriber = new GroupSubscriber({
        subscriber: subscriberId,
        group: groupId,
        organization: group.organization,
      }) as GroupSubscriberDoc;
      await groupSubscriber.save();
      groupSubscribers.push(groupSubscriber);
    }

    new CreateSuccess(res).send(
      "Assigned Subscriber(s) Successfully",
      groupSubscribers
    );
  }

  /**
   * Unassign subscriber from group
   * @param req
   * @param res
   */
  async unAssignSubscriberFromGroup(req: Request, res: Response) {
    const { groupId, subscriberIds } = req.body;

    // Get the Group
    const group = await Group.findById(groupId);
    if (!group) {
      throw new BadRequestError("Group not found");
    }

    await GroupSubscriberRepository.unAssign(groupId, subscriberIds);

    new DeleteSuccess(res).send(
      `Subscribers unassigned successfully: ${subscriberIds.length} subsribers deleted`
    );
  }

  /**
   * List subscribers in a group
   * @param req
   * @param res
   */
  async listGroupSubscribers(req: Request, res: Response) {
    const { id } = req.params;

    const { page, limit } = req.query;

    const pagination = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
    };

    const { totalDocuments, totalPages, data } =
      await GroupSubscriberRepository.listGroupSubscribers(id, pagination);

    new GetSuccess(res).send({ totalDocuments, totalPages, data });
  }

  /**
   * List groups by subscriber ID
   * @param req
   * @param res
   */
  async listGroupsBySubscriberId(req: Request, res: Response) {
    const { id } = req.params;
    const { page, limit } = req.query;

    const pagination = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
    };

    const { totalDocuments, totalPages, data } =
      await GroupSubscriberRepository.listGroupsBySubscriberId(id, pagination);

    return new GetSuccess(res).send({ totalDocuments, totalPages, data });
  }

  /**
   * Import subscribers to a group
   * @param req
   * @param res
   */
  async importSubscribersToGroup(req: Request, res: Response) {
    const { groupId, orgId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      throw new BadRequestError("Group not found");
    }

    if (!req.file) {
      throw new BadRequestError("File not found");
    }

    res
      .status(201)
      .send({ message: "Importing subscribers to the group has started" });

    await SubscriberRepository.importSubscribers(
      orgId,
      req.file.buffer,
      groupId
    );

    return new GetSuccess(res).send(
      "Successfully imported subscribers to group"
    );
  }
}

export default new SubscriberGroupsController();
