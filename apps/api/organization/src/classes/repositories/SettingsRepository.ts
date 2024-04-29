import { IRepository } from "@interfaces/IRepository";
import { ISettings } from "@interfaces/ISettings";
import { Settings } from "@models/settings";

class SettingsRepository implements IRepository<ISettings> {
  create(data: ISettings): Promise<ISettings> {
    return Settings.build(data).save();
  }

  async delete(id: string): Promise<void> {
    await Settings.deleteOne({ _id: id });
  }

  get(id: string): Promise<ISettings | null> {
    return Settings.findById(id);
  }

  list(orgId: string): Promise<ISettings[]> {
    return Settings.find({ organization: orgId });
  }

  async update(
    id: string,
    updatedFields: ISettings,
  ): Promise<ISettings> {
    const settings = await Settings.findById(id);

    if(!settings){
      throw new Error("Organization not found")
    }

    settings.set(updatedFields)

    settings.save();

    return settings
  }
}

export default new SettingsRepository()
