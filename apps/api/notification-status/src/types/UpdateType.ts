export type UpdateType = {
  $set: {
    status: string; // Assuming NotificationStatus is a type you've defined elsewhere
    conversationId: string | undefined;
    failure_reason?: string; // Optional property
  };
};
