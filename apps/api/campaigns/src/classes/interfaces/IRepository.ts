import { IPageRequestArgs } from "./IPageArgs";

export interface IRepository<T> {
  list(
    orgId: string,
    pagination?: IPageRequestArgs,
    campaignId?: string
  ): Promise<{
    totalDocuments: number;
    totalPages: number;
    data: T[];
  }>;

  get(id: string, orgId: string): Promise<T | null>;

  create(data: T): Promise<T>;

  update(id: string, updatedFields: Partial<T>): Promise<T>;

  delete(id: string): Promise<void>;
}
