export interface IPageRequestArgs {
  page: number;
  limit: number;
  search: string;
}

export interface SearchQuery {
  organization: string;
  $or?: { [key: string]: { $regex: string, $options: string } }[];
  campaign?: string;
  subscriberGroup?: { $exists: true };
}
