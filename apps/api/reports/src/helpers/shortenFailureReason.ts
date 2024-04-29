type FailureReasonReplacements = {
  [key: string]: string | undefined;
};

export function shortenFailureReason(reason: string): string {
  const replacements: FailureReasonReplacements = {
    "Message failed to send because the user is unreachable. Make sure you have entered the correct phone number.":
      "User Unreachable",
    "Message failed to send because there are restrictions on how many messages can be sent from this phone number.This may be because too many previous messages were blocked or flagged as spam.":
      "Restrictions due to spam/flagged",
    "Image is invalid. Please check the image properties; supported are JPG/JPEG, RGB/RGBA, 8 bit/channels and PNG, RGB/RGBA, up to 8 bit/channel.": "Image Invalid, must be RGB/PNG"
  };

  return replacements[reason] || reason;
}
