import { Subjects } from "./subjects";

export interface PlanCreatedEvent {
  subject: Subjects.PlanCreated;
  data: {
    id: string;
    title: string;
    term: string;
    price: number;
    description: string;
    includes: string[];
    version: number;
  };
}
export interface PlanUpdatedEvent {
  subject: Subjects.PlanUpdated;
  data: {
    id: string;
    title?: string;
    term?: string;
    price?: number;
    description?: string;
    includes?: string[];
    version: number;
  };
}
