import { FilterQuery, Model } from "mongoose";
import {
  DateRange,
  IPageRequestArgs,
  SearchQuery,
} from "@interfaces/IPageArgs";
import { IRepository } from "@interfaces/IRepository";

export class BaseRepository<T> implements IRepository<T> {
  //eslint-disable-next-line
  constructor(public model: Model<any>) {}

  /**
   * Generic Create Method
   * @param data
   */
  async create(data: T): Promise<T> {
    return this.model.create(data);
  }

  /**
   * Generic List Method
   * @param orgId
   * @param pagination
   * @param searchQuery
   * @param dateRange
   */
  async list(
    orgId: string,
    pagination?: IPageRequestArgs,
    searchQuery?: SearchQuery,
    dateRange?: DateRange,
  ): Promise<{
    totalDocuments: number;
    totalPages: number;
    data: T[];
  }> {
    if (!pagination) {
      throw new Error("Pagination parameters are required.");
    }

    const { page, limit, search } = pagination;

    if (page <= 0 || limit <= 0) {
      throw new Error("Page and limit parameters must be greater than zero.");
    }

    const skip = (page - 1) * limit;

    const query: FilterQuery<SearchQuery> = { organization: orgId };

    if (searchQuery) {
      if (searchQuery.group) {
        query.group = searchQuery.group;
      }
      if (searchQuery.subscriber) {
        query.subscriber = searchQuery.subscriber;
      }
      if (searchQuery.subscriberGroup !== undefined) {
        query.subscriberGroup = searchQuery.subscriberGroup;
      }
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { reference: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    } 

    if (dateRange && dateRange.startDate && dateRange.endDate) {
      query.createdAt = {
        $gte: dateRange.startDate,
        $lte: dateRange.endDate,
      };
    }

    const data = await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalDocuments = await this.model.countDocuments(query);

    const totalPages = Math.ceil(totalDocuments / limit);

    return { totalDocuments, totalPages, data };
  }

  /**
   * Generic Fetch Method
   * @param orgId
   * @param id
   * @param selectFields - optional
   */
  async get(
    orgId: string,
    id: string,
    selectFields?: string
  ): Promise<T | null> {
    let query = this.model.findOne({ organization: orgId, _id: id });

    if (selectFields) {
      query = query.select(selectFields);
    }

    return query.exec();
  }

  /**
   * Generic Update Method
   * @param id
   * @param updatedFields
   */
  async update(id: string, updatedFields: Partial<T>): Promise<T> {
    const item = await this.model.findById(id);

    if (!item) {
      throw new Error("Item not found");
    }

    item.set(updatedFields);

    await item.save();

    return item;
  }

  /**
   * Generic Delete Method
   * @param orgId
   * @param itemIds
   */
  async delete(itemIds: string | string[], orgId?: string): Promise<void> {
    await this.model.deleteMany({ _id: { $in: itemIds }, organization: orgId });
  }
}
