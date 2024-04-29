import OrganizationRepository from "@repositories/OrganizationRepository";
import mongoose from "mongoose";
import { Plan } from "@models/plan";

describe("OrganizationRepository tests", () => {
  it(" should create an organization", async () => {
    const planId = new mongoose.Types.ObjectId().toString();
    const organization = await OrganizationRepository.create({
      name: "Test Organization",
      plan: planId,
    });

    expect(organization.name).toBe("Test Organization");
    expect(organization.plan.toString()).toBe(planId);
  });

  it(" should delete an organization", async () => {
    const planId = new mongoose.Types.ObjectId().toString();
    const organization = await OrganizationRepository.create({
      name: "Test Organization",
      plan: planId,
    });

    await OrganizationRepository.delete(organization.id);

    const deletedOrganization = await OrganizationRepository.get(
      organization.id,
    );

    expect(deletedOrganization).toBeNull();
  });

  it(" should get an organization", async () => {
    const plan = new Plan({
      title: "Test Plan",
      term: "monthly",
      price: 10,
      features: ["Feature 1", "Feature 2"],
    });

    await plan.save();

    const organization = await OrganizationRepository.create({
      name: "Test Organization",
      plan: plan._id,
    });

    const retrievedOrganization = await OrganizationRepository.get(
      organization.id,
    );

    expect(retrievedOrganization!.name).toBe("Test Organization");
  });

  it(" should list organizations", async () => {
    const planId = new mongoose.Types.ObjectId().toString();
    const organization1 = await OrganizationRepository.create({
      name: "Test Organization 1",
      plan: planId,
    });

    const organization2 = await OrganizationRepository.create({
      name: "Test Organization 2",
      plan: planId,
    });

    const organizations = await OrganizationRepository.list();

    expect(organizations.length).toBe(2);
    expect(organizations[0].name).toBe(organization1.name);
    expect(organizations[1].name).toBe(organization2.name);
  });

  it(" should update an organization", async () => {
    const planId = new mongoose.Types.ObjectId().toString();
    const organization = await OrganizationRepository.create({
      name: "Test Organization",
      plan: planId,
    });

    const updatedOrganization = await OrganizationRepository.update(
      organization.id,
      { name: "Updated Organization" },
    );

    expect(updatedOrganization.name).toBe("Updated Organization");
    expect(updatedOrganization.plan.toString()).toBe(planId);
  });
});
