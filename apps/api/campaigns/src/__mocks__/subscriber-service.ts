import mongoose from "mongoose";

const subscriber = {
  id: new mongoose.Types.ObjectId().toHexString(),
  firstName: "test",
  lastName: "test",
  mobileNumber: "254712345678",
  organization: "5f9d5a8b9d3f2b001c3b0e1a",
  optInStatus: true,
};

export const subscriberService = jest
  .fn()
  .mockImplementation(
    (req: Request, subscriberGroup: string, organization: string) => {
      return [{ ...subscriber, organization }];
    }
  );
