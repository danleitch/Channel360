import { Subjects } from "./subjects";
import { Tag } from "../utilities/TemplateTagValidator";

export interface TemplateIngestedEvent {
  subject: Subjects.TemplateIngested;
  data: {
    organization: string;
    name: string;
    description: string;
    enabled: boolean;
    status: string;
    language: string;
    category: string;
    components: Component[];
    id: any;
    messageTemplateId: string;
  };
}

export interface TemplateSyncEvent {
  subject: Subjects.TemplateSync;
  data: {};
}

export interface TemplateDeletedEvent {
  subject: Subjects.TemplateDeleted;
  data: {
    id: string;
    name: string;
    version: number;
  };
}

export interface TemplateImportedEvent {
  subject: Subjects.TemplateImported;
  data: {
    id: string;
    organization: string;
    name: string;
    namespace: string;
    description: string;
    status: string;
    enabled: boolean;
    language: string;
    category: "MARKETING" | "AUTHENTICATION" | "UTILITY";
    components: Component[];
    tags: Tag;
    version: number;
    messageTemplateId?: string;
  };
}

export interface TemplateCreatedEvent {
  subject: Subjects.TemplateCreated;
  data: {
    organization: string;
    name: string;
    description: string;
    namespace: string;
    enabled: boolean;
    status: string;
    language: string;
    category: string;
    components: Component[];
    tags: Tag;
    messageTemplateId?: string;
  };
}

export interface TemplateUpdatedEvent {
  subject: Subjects.TemplateUpdated;
  data: {
    id: string;
    organization: string;
    name?: string;
    status?: string;
    language?: string;
    category?: "MARKETING" | "AUTHENTICATION" | "UTILITY";
    components?: Component[];
    tags?: Tag;
    description?: string;
    enabled?: string;
    messageTemplateId?: string;
    version: number;
  };
}

export interface TemplateInternalUpdatedEvent {
  subject: Subjects.TemplateInternalUpdated;
  data: {
    id: string;
    organization: string;
    status?: string;
    tags?: Tag;
    components?: Component[];
    description?: string;
    enabled?: boolean;
    version: number;
    messageTemplateId?: string;
  };
}

export interface Component {
  type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
  format?: "TEXT" | "IMAGE" | "DOCUMENT" | "VIDEO";
  text?: string;
  buttons?: Button[];
}


export interface ParameterComponent {
  type: "HEADER" | "BODY" | "FOOTER" | "BUTTON";
  parameters: Parameter[],
  sub_type?:string,
  index?:number
}

export interface Parameter{
  type: "text" | "image" | "document" | "video",
  text?: string,
  image?: any,
  document?: any,
  video?: any
  sub_type?: string
  index?:number
}


export interface Button {
  type: "QUICK_REPLY" | "PHONE_NUMBER" | "URL";
  phoneNumber?: string;
  text?: string;
  url?: string;
}

export type TagType =
  | "csv"
  | "hard-coded"
  | "on-campaign-creation"
  | "subscriber-field"
  | "image"
  | "document";
