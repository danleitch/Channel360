import { Subscriber, SubscriberDoc } from "@models/subscriber";
import SubscriberRepository from "@repositories/SubscriberRepository";
import { ImportSubscribersToGroupSeeder } from "@seeders/ImportSubscribersToGroupSeeder";

describe("Subscriber Repository CRUD Operations Tests: Successful ✅ 👤", () => {
  it("SHOULD create a subscriber: Successfully ✅ 👤", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const data = {
      mobileNumber: "+27142199054",
      firstName: "John",
      lastName: "Smith",
      optInStatus: true,
    } as SubscriberDoc;

    const createSubscriber = await SubscriberRepository.create(data);

    expect(createSubscriber).toBeDefined();
    expect(createSubscriber.firstName).toBe("John");
  });

  it("SHOULD update a subscriber successfully", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscriber = await Subscriber.findOne();
    const subscriberId = subscriber!.id;

    const data = {
      mobileNumber: "+27000000001",
      firstName: "New John",
      lastName: "New Smith",
      optInStatus: true,
    };
    const createSubscriber = await SubscriberRepository.update(
      subscriberId,
      data
    );

    expect(createSubscriber).toBeDefined();
    expect(createSubscriber.firstName).toBe("New John");
    expect(createSubscriber.lastName).toBe("New Smith");
    expect(createSubscriber.optInStatus).toBe(true);
    expect(createSubscriber.mobileNumber).toBe("+27000000001");
  });

  it("SHOULD get a subscriber (by ID) successfully", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscriber = await Subscriber.findOne();
    const existingSubscriberId = subscriber!.id;
    const existingOrgId = subscriber!.organization;

    const createSubscriber = await SubscriberRepository.get(
      existingOrgId,
      existingSubscriberId
    );

    expect(createSubscriber!.mobileNumber).toBeTruthy();
    expect(createSubscriber!.organization).toStrictEqual(existingOrgId);
  });

  it("SHOULD delete a subscriber (by ID) successfully", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscriber = await Subscriber.findOne();

    const existingSubscriberId = subscriber!.id;
    const orgId = subscriber!.organization;

    await SubscriberRepository.delete(existingSubscriberId, orgId);

    const subscriberDeletedFromDB = await Subscriber.findById(
      existingSubscriberId
    );

    expect(subscriberDeletedFromDB).toBeNull();
  });

  it("SHOULD list a subscribers successfully", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscriber = await Subscriber.findOne();
    const orgId = subscriber!.organization;

    const pagination = {
      page: 1,
      limit: 10,
      search: "John",
    };

    const list = await SubscriberRepository.list(orgId, pagination);

    expect(list.data.length).toBeGreaterThan(0);
    expect(list.totalDocuments).toBe(1);
    expect(list.totalPages).toBe(1);
  });

  it("should find subscribers by organization and paginate search and date range (startDate & endDate)", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const subscriber = await Subscriber.findOne();

    if (!subscriber) {
      throw new Error("No subscriber found.");
    }
    const orgId = subscriber.organization;

    const pagination = {
      page: 1,
      limit: 10,
      search: "John",
    };

    const dateRangeWithOrgId = {
      organization: orgId,
      startDate: "2024-01-01",
      endDate: "2024-03-31",
    };

    const result = await SubscriberRepository.list(
      orgId,
      pagination,
      dateRangeWithOrgId
    );

    expect(result.data.length).toBe(pagination.page);
    expect(result.totalDocuments).toStrictEqual(1);
    expect(result.totalPages).toStrictEqual(1);
  });
});
