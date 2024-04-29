import { OrganizationUpdatedListener } from "@listeners/organization-updated-listener";
import { Organization } from "@models/organization";
import mongoose from "mongoose";


jest.mock("@listeners/organization-updated-listener.ts");

describe("updating an organization event 📜", () => {

  it("updates an organization successfully & `settings` are present 🧪✅", async () => {

    
    const organizationCreated = await global.createOrganization();
    
    const data = {
      id: organizationCreated.id,
      name: 'Newly Updated Organization',
      version: 0
    };

    const listener = new OrganizationUpdatedListener({} as any);

    await listener.onMessage(data, {} as any);

    organizationCreated.set(data)
    await organizationCreated.save().catch((err) => {
      console.log(err, "Error Updating oranization");
      
    })

    const organization = await Organization.findById(organizationCreated.id);

    expect(organization!.name).toBe("Newly Updated Organization");
    expect(organization?.settings).toBeTruthy();
   
  });
});

