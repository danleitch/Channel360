import { Tag, Component } from "@channel360/core";

export interface TemplateAttrs {
  id: string;
  organization: string;
  name: string;
  description: string;
  namespace: string;
  language: string;
  category: string;
  tags?: Tag;
  status?: string;
  enabled?: boolean;
  components: Component[];
  messageTemplateId?: string;
}
