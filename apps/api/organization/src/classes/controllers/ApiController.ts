import {
  BadRequestError,
  CreateSuccess,
  DeleteSuccess,
  GetSuccess,
  UpdateSuccess,
} from "@channel360/core";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { IAPIKey } from "@interfaces/IAPIKey";
import { natsWrapper } from "../../nats-wrapper";
import { IController } from "@interfaces/IController";
import ApiKeyRepository from "@repositories/ApiKeyRepository";
import OrganizationRepository from "@repositories/OrganizationRepository";
import { APIKeyCreatedPublisher } from "@publishers/api-key-created-publisher";

class ApiController implements IController<IAPIKey> {
  async create(req: Request, res: Response) {
    const { orgId } = req.params;

    const organization = await OrganizationRepository.get(orgId);

    if (!organization) throw new BadRequestError("Organization not found");

    const apiKey = jwt.sign(
      {
        id: organization.id,
        name: organization.name,
      },
      process.env.JWT_KEY!,
    );

    const key = await ApiKeyRepository.create({
      apiKey,
      organization: orgId,
    });

    await new APIKeyCreatedPublisher(natsWrapper.client).publish({
      id: key.id,
      organization: key.organization,
      apiKey: key.apiKey,
      revoked: false,
    });

    return new CreateSuccess(res).send("API Key created successfully", {
      key: key.apiKey,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await ApiKeyRepository.delete(req.params.id);
    return new DeleteSuccess(res).send("API Key deleted successfully");
  }

  async get(req: Request, res: Response): Promise<Response<IAPIKey>> {
    const apiKey = await ApiKeyRepository.get(req.params.id);
    return new GetSuccess(res).send(apiKey);
  }

  async list(req: Request, res: Response): Promise<Response<IAPIKey>> {
    const apiKeys = await ApiKeyRepository.list(req.params.orgId);

    apiKeys.forEach((key) => {
      if (key.apiKey.length > 8) {
        const hiddenPart = '*'.repeat(5);
        const visiblePart = key.apiKey.slice(-8);
        key.apiKey = hiddenPart + visiblePart;
      } else {
        key.apiKey = "********"; // Replace with stars if the key length is less than 8 characters
      }
    });

    return new GetSuccess(res).send(apiKeys);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body;

    const apiKey = await ApiKeyRepository.update(id, data);

    return new UpdateSuccess(res).send("API Key updated successfully", apiKey);
  }
}

export default new ApiController();
