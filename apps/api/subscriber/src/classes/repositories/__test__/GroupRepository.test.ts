import { Group, GroupDoc } from "@models/group";
import { Organization } from "@models/organization";
import GroupRepository from "@repositories/GroupRepository";
import { ImportSubscribersToGroupSeeder } from "@seeders/ImportSubscribersToGroupSeeder";

describe("Group CRUD Operations Tests: 🧪 🧑‍💻", () => {
  it("should update an existing group: Successfully ✅ 👥", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const group = await Group.findOne();
    const groupId = group!.id;
    const updatedFields = {
      name: "Updated Test Group",
      description: "Updated Test Description",
      enabled: true,
    };
    const updatedGroup = await GroupRepository.update(groupId, updatedFields);

    expect(updatedGroup.description).toBe("Updated Test Description");
  });

  it("should create an group: Successfully ✅ 👥", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const organization = await Organization.findOne();
    const orgId = organization!.id;

    const buildGroup = {
      organization: orgId,
      name: "Testing Group Creation",
      description: "Test Description",
    } as GroupDoc;

    const createdGroup = await GroupRepository.create(buildGroup);

    expect(createdGroup.name).toBe("Testing Group Creation");
  });

  it("should get an existing group: Successfully ✅ 👥", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const group = await Group.findOne();
    const groupId = group!.id;
    const orgId = group!.organization;

    const getExistingGroup = await GroupRepository.get(orgId, groupId);

    expect(getExistingGroup!.name).toBe(group!.name);
  });

  it("should list (searched & paginated) groups: Successfully ✅ 👥", async () => {
    await new ImportSubscribersToGroupSeeder().seed();

    const group = await Group.findOne();
    const orgId = group!.organization;

    const pagination = {
      page: 1,
      limit: 10,
      search: "Dummy Group",
    };

    const groups = await GroupRepository.list(orgId, pagination);

    expect(groups.data).toBeDefined();
    expect(groups.totalDocuments).toBeGreaterThan(0);
    expect(groups.totalPages).toBeGreaterThan(0);
  });
});
