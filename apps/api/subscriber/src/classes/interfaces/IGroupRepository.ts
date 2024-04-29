import { IPageRequestArgs } from "@interfaces/IPageArgs";

export interface IGroupRepository<T> {
  list(
    orgId: string,
    pagination?: IPageRequestArgs,
    groupId?: string
  ): Promise<{
    totalDocuments: number;
    totalPages: number;
    data: T[];
  }>;

  get(
    orgId: string,
    groupId: string
  ): Promise<{ data: T | null; totalDocuments?: number }>;

  create(data: T): Promise<T>;

  update(groupId: string, data: Partial<T>): Promise<T>;

  delete(groupId: string): Promise<void>;
}
