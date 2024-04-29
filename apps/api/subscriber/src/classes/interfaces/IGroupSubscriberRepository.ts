export interface IGroupSubscriberRepository<T> {
  create(
    subscriberIds: string[],
    groupId: string,
    organization?: string
  ): Promise<T>;
  get(orgId?: string, groupId?: string): Promise<T[]>;
}
