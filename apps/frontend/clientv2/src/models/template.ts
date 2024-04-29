export interface Tag {
  index?: number;
  type: string;
  value?: string;
  fields?: string;
  url?: string;
  document?: { link: string };
}

export interface SelectedTag {
  index: number;
  contentType: string;
  type: string;
  value?: string;
  fields?: string;
}

export interface NotificationTag {
  type: string;
  text: string;
}

export interface Button {
  type: 'PHONE_NUMBER' | 'URL' | 'QUICK_REPLY';
  phoneNumber?: string;
  url?: string;
  text?: string;
}

export interface ButtonsObject {
  buttons: Button[];
}
export interface Template {
  id: string;
  tags: {
    head: Tag[];
    body: Tag[];
    buttons: Tag[];
  };
  components: Component[];
  name: string;
  description: string;
  language: string;
  category: string;
  status: string;
  enabled: boolean;
  createdAt: Date;
}

export interface Component {
  type: string;
  format?: string;
  text?: string;
  buttons: any[];
}
