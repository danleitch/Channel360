import {
  IPageRequestArgs,
  DateRange,
  SearchQuery
} from "./IPageArgs";

export interface IRepository<T> {
  list(
    orgId: string,
    pagination?: IPageRequestArgs,
    searchQuery?: SearchQuery,
    dateRange?: DateRange,
    searchFilter?: string,
  ): Promise<{
    totalDocuments: number;
    totalPages: number;
    data: T[];
  }>;

  get(orgId: string, itemId: string): Promise<T | null>;

  create(data: T): Promise<T>;

  update(id: string, updatedFields: Partial<T>): Promise<T>;

  delete(itemIds: string | string[], orgId?: string): Promise<void>;
}
