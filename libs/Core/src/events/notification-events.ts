import { Subjects } from "./subjects";

export interface NotificationCreatedEvent {
  subject: Subjects.NotificationCreated;
  data: {
    id: string;
    category: string;
    organizationId: string;
    campaignId?: string;
    destinationId: string;
    scheduled?: Date;
    message: {
      type: string;
      template: {
        namespace?: string;
        name: string;
        language: {
          policy: string;
          code: string;
        };
        components?: {
          type: string;
          text?: string;
          format?: string;
          buttons?: [{ type?: string; phoneNumber?: string; url?: string }];
          parameters?: [
            {
              type: string;
              text?: string;
              image?: {
                link: string;
              };
              document?: {
                link: string;
                filename: string;
              };
            },
          ];
        }[];
      };
    };
  };
}

export interface NotificationSentEvent {
  subject: Subjects.NotificationSent;
  data: {
    id: string;
    campaign?: string;
    mobileNumber: string;
    notification_id: string;
    organization: string;
    status: string;
  };
}

export interface NotificationDeliveryEvent {
  subject: Subjects.NotificationDeliveryChannel;
  data: {
    status: string;
    trigger?: string;
    app?: {
      _id: string;
    };
    appUser?: {
      _id: string;
    };
    isFinalEvent?: boolean;
    destination: {
      type?: string;
      integrationId?: string;
      destinationId: string;
    };

    notification: {
      _id: string;
    };
    conversation?: {
      _id: string;
    };
    matchResult: {
      appUser: {
        _id: string;
        userId: string;
        conversationStarted?: boolean;
      };
      conversation?: {
        _id: string;
      };
    };
    messages?: [
      {
        _id: string;
        role: string;
        type: string;
        text: string;
        authorId: string;
        name: string;
        received: number;
        source: {
          type: string;
          id: string;
          integrationId: string;
          originalMessageId: string;
          originalMessageTimestamp: number;
        };
      },
    ];
  };
}

export interface AppMessageEvent {
  subject: Subjects.MessageAppUser;
  data: {
    trigger?: string;
    app?: {
      _id: string;
    };
    conversation?: {
      _id: string;
    };
    messages?: [
      {
        _id: string;
        role: string;
        type: string;
        text: string;
        authorId: string;
        name: string;
        received: number;
        source: {
          type: string;
          id: string;
          integrationId: string;
          originalMessageId: string;
          originalMessageTimestamp: number;
        };
      },
    ];
  };
}

export interface NotificationStatusEvent {
  subject: Subjects.NotificationStatusCreated;
  data: {
    id?: string;
    organization: string;
    app: {
      _id: string;
    };
    appUser?: {
      _id: string;
      conversationStarted: boolean;
    };
    trigger: string;
    destination?: {
      destinationId: string;
    };
    notification?: {
      _id: string;
    };
    matchResult?: {
      appUser: {
        _id: string;
        conversationStarted?: boolean;
      };
      conversation?: {
        _id: string;
      };
    };
    conversation?: {
      _id: string;
    };
    messages?: {
      text: string;
      authorId: string;
    };
    error?: {
      message: string;
      code: string;
    }
  };
}
