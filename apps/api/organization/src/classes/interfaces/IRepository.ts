export interface IRepository<T> {
  list(orgId: string): Promise<T[]>;

  get(id: string): Promise<T | null>;

  create(data: T): Promise<T>;

  update(id: string, updatedFields: Partial<T>): Promise<T>;

  delete(id: string): Promise<void>;
}
