import { IRepository } from "@interfaces/IRepository";
import { IOrganization } from "@interfaces/IOrganization";
import { Organization, OrganizationDoc } from "@models/organization";

class OrganizationRepository implements IRepository<IOrganization> {
  async create(data: IOrganization): Promise<OrganizationDoc> {
    const organization = await Organization.build(data);
    await organization.save();
    return organization;
  }

  async delete(id: string): Promise<void> {
    await Organization.deleteOne({ _id: id });
  }

  get(id: string): Promise<OrganizationDoc | null> {
    return Organization.findById(id).populate("users plan");
  }

  list(): Promise<OrganizationDoc[]> {
    return Organization.find();
  }

  async update(
    id: string,
    updatedFields: { name?: string; plan?: string },
  ): Promise<OrganizationDoc> {
    const organization = await Organization.findById(id);

    if (!organization) {
      throw new Error("Organization not found");
    }

    organization.set(updatedFields);

    organization.save();

    return organization;
  }
}

export default new OrganizationRepository();
