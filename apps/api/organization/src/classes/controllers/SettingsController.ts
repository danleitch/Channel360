import { ISettings } from "@interfaces/ISettings";
import { Request, Response } from "express";
import SettingsRepository from "@repositories/SettingsRepository";
import { BadRequestError, GetSuccess, UpdateSuccess } from "@channel360/core";
import OrganizationRepository from "@repositories/OrganizationRepository";

export class SettingsController {
  async get(req: Request, res: Response): Promise<Response<ISettings>> {
    const { orgId } = req.params;

    const organization = await OrganizationRepository.get(orgId);

    if (!organization) {
      throw new BadRequestError("Organization not found");
    }
    const settings = await SettingsRepository.get(organization.settings);

    return new GetSuccess(res).send(settings);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { orgId } = req.params;

    const updateFields = req.body;

    const organization = await OrganizationRepository.get(orgId);

    if (!organization) {
      throw new BadRequestError("Organization not found");
    }
    const settings = await SettingsRepository.update(
      organization.settings,
      updateFields,
    );

    return new UpdateSuccess(res).send(
      "Settings updated successfully",
      settings,
    );
  }
}

export default new SettingsController();
