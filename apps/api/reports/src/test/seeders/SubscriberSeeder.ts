import { modelRegistry } from "@models/index";

export class SubscriberSeeder {
  private static get subscriberModel() {
    if (!modelRegistry.Subscriber) {
      throw new Error("Notification model is not initialized.");
    }
    return modelRegistry.Subscriber;
  }

  public static async seed(orgId: string, subscribersToCreate: number) {
    await this.subscriberModel.deleteMany();

    for (let i = 0; i < subscribersToCreate; i++) {
      const subscriber = new this.subscriberModel({
        organization: orgId,
        mobileNumber: randomMobileNumber(),
        firstName: randomName(),
        lastName: randomLastName(),
        optInStatus: randomBoolean(),
        createdAt: new Date(
          new Date().getTime() -
            Math.floor(Math.random() * 1000 * 60 * 60 * 24),
        ),
        updatedAt: new Date(
          new Date().getTime() -
            Math.floor(Math.random() * 1000 * 60 * 60 * 24),
        ),
      });
      await subscriber.save();
    }
  }
}

// Random name
const randomName = () => {
  const names = ["John", "Jane", "Bob"];
  return names[Math.floor(Math.random() * names.length)];
};

// Random Last Name
const randomLastName = () => {
  const lastNames = ["Doe", "Smith", "Jones"];
  return lastNames[Math.floor(Math.random() * lastNames.length)];
};
const randomMobileNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};


const randomBoolean = () => {
  return Math.random() < 0.5;
};