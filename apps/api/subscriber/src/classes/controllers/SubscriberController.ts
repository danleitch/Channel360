import { Request, Response } from "express";
import SubscriberRepository from "@repositories/SubscriberRepository";
import {
  BadRequestError,
  CreateSuccess,
  DeleteSuccess,
  GetSuccess,
  UpdateSuccess,
} from "@channel360/core";
import { Subscriber, SubscriberDoc } from "@models/subscriber";
import { Parser } from "json2csv";
import GroupSubscriberRepository from "@repositories/GroupSubscriberRepository";

class SubscriberController {
  /**
   * Create a new subscriber
   * @param req
   * @param res
   */
  async create(req: Request, res: Response) {
    const { orgId } = req.params;

    const { mobileNumber, firstName, lastName } = req.body;

    // Check if mobileNumber starts with '+'
    const normalizedMobileNumber = mobileNumber.startsWith("+")
      ? mobileNumber
      : `+${mobileNumber}`;

    const data = {
      organization: orgId,
      mobileNumber: normalizedMobileNumber,
      firstName,
      lastName,
    } as SubscriberDoc;

    const subscriber = await SubscriberRepository.create(data);

    return new CreateSuccess(res).send(
      "Subscriber Created Successfully",
      subscriber
    );
  }

  /**
   * Update a Subscriber
   * @param req
   * @param res
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;

    const subscriber = await Subscriber.findById(id);

    if (!subscriber) {
      throw new BadRequestError("Subscriber not found");
    }

    const { mobileNumber, firstName, lastName, optInStatus } = req.body;

    const updatedFields = await SubscriberRepository.update(id, {
      mobileNumber,
      firstName,
      lastName,
      optInStatus,
    });

    return new UpdateSuccess(res).send(
      "Subscriber Updated Successfully",

      updatedFields
    );
  }

  /**
   * Get a subscriber
   * @param req
   * @param res
   */
  async get(req: Request, res: Response) {
    const { orgId, id } = req.params;

    const subscriber = await SubscriberRepository.get(
      orgId,
      id,
      "firstName lastName mobileNumber optInStatus createdAt updatedAt id"
    );
    if (!subscriber) {
      throw new BadRequestError("Subscriber not found");
    }

    // Page and limit for group pagination
    const { page, limit } = req.query;

    const pagination = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
    };

    const groups = await GroupSubscriberRepository.listGroupsBySubscriberId(
      id,
      pagination
    );

    return new GetSuccess(res).send({ ...subscriber.toJSON(), groups });
  }

  /**
   * List all subscribers
   * @param req
   * @param res
   */
  async list(req: Request, res: Response) {
    const { orgId } = req.params;
    const { page, limit, search } = req.query;

    const pagination = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      search: (search as string) || "",
    };

    const { totalDocuments, totalPages, data } =
      await SubscriberRepository.list(orgId, pagination);

    return new GetSuccess(res).send({
      totalDocuments,
      totalPages,
      data,
    });
  }

  /**
   * Delete a subscriber
   * @param req
   * @param res
   */
  async delete(req: Request, res: Response) {
    const orgId = req.params.orgId;

    const subscriberId = req.params.id;

    const subscriber = await Subscriber.findById(subscriberId);

    if (!subscriber) {
      throw new BadRequestError("Subscriber not found");
    }

    await SubscriberRepository.delete(subscriberId, orgId);

    return new DeleteSuccess(res).send("Subscriber Deleted Successfully");
  }

  /**
   * Batch delete subscribers
   * @param req
   * @param res
   */
  async batchDelete(req: Request, res: Response) {
    const { orgId } = req.params;

    const { subscriberIds } = req.body;

    const subscribers = await Subscriber.find({ _id: { $in: subscriberIds } });

    if (subscribers.length === 0) {
      throw new BadRequestError("Subscriber(s) not found");
    }

    await SubscriberRepository.delete(subscriberIds, orgId);

    return new DeleteSuccess(res).send("Subscriber(s) Deleted Successfully");
  }

  /**
   * Import subscribers
   * @param req
   * @param res
   */
  async importSubscribers(req: Request, res: Response) {
    const orgId = req.params.orgId;

    if (!req.file) {
      throw new BadRequestError("No file found");
    }

    res.status(201).send({ message: "Importing subscribers has started" });

    await SubscriberRepository.importSubscribers(orgId, req.file.buffer);
    return new GetSuccess(res).send("Subscribers imported successfully");
  }

  /**
   * Export subscribers
   * @param req
   * @param res
   */
  async export(req: Request, res: Response) {
    const { orgId } = req.params;
    const { startDate, endDate, page, limit, search } = req.query;

    // Ensure startDate and endDate are provided
    if (!startDate || !endDate) {

      throw new BadRequestError("Both startDate and endDate must be provided");
    }

    // Extract pagination parameters
    const pagination = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      search: (search as string) || "",
    };


    const { data } = await SubscriberRepository.list(orgId, pagination);


    if (!data || data.length === 0) {

      throw new BadRequestError(

        "No subscribers found for the provided date range"
      );
    }


    // Convert subscribers to CSV format
    const csvData = data.map((subscriber) => ({

      mobileNumber: subscriber.mobileNumber,
      firstName: subscriber.firstName,
      lastName: subscriber.lastName,
      optInStatus: subscriber.optInStatus,
    }));


    // Set the response headers to download the CSV file
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="subscribers.csv"`
    );
    
    
    const json2csvParser = new Parser({ quote: ""});

    const updatedCsv = json2csvParser.parse(csvData);

    const  csv = updatedCsv.replace(/"/g, '');

    
    res.status(200).send(csv);
  }
}

export default new SubscriberController();
