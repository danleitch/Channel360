import { IRepository } from "@interfaces/IRepository";
import { IAPIKey } from "@interfaces/IAPIKey";
import { APIKey, APIKeyDoc } from "@models/api-key";

export class ApiKeyRepository implements IRepository<IAPIKey> {
  create(data: IAPIKey): Promise<APIKeyDoc> {
    return APIKey.build(data).save();
  }

  async delete(id: string): Promise<void> {
    await APIKey.deleteOne({ _id: id });
  }

  get(id: string): Promise<APIKeyDoc | null> {
    return APIKey.findById(id);
  }

  list(orgId: string): Promise<APIKeyDoc[]> {
    return APIKey.find({ organization: orgId });
  }

  async update(id: string, updatedFields: IAPIKey): Promise<APIKeyDoc> {
    const apiKey = await APIKey.findById(id);

    if (!apiKey) {
      throw new Error("API Key not found");
    }

    apiKey.set(updatedFields);

    apiKey.save();

    return apiKey
  }
}

export default new ApiKeyRepository()