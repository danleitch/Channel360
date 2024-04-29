export interface DeliveryData {
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
  error?: {
    message: string;
    code: string;
    underlyingError: {
      status: number;
      message: string;
    };
  };
  messages?: {
    text: string;
    authorId: string;
  };
}
