export interface IPageRequestArgs {
  page: number;
  limit: number;
  search?: string;
}

export interface SearchQuery {
  organization: string;
  group?: string;
  subscriber?: string;
  $or?: { [key: string]: { $regex: string; $options: string } }[];
  subscriberGroup?: { $exists: true } | undefined;
  createdAt?: { $gte: string; $lte: string };
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ModelInterface {
  subscriber: string;
  group: string;
  subsriberGroup?: string;
}
