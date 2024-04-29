import express, { Request, Response } from "express";
import { BadRequestError } from "@channel360/core";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Organization } from "@models/organization";
import { SmoochApp } from "@models/smoochApp";

const router = express.Router({mergeParams: true});

router.use(async (req: Request, res: Response) => {
  const organization = await Organization.findById(req.params.orgId);
  if (!organization) {
    throw new BadRequestError("Organization not found");
  }

  const smoochApp = await SmoochApp.findOne({
    organization: organization.id,
  });
  if (!smoochApp) {
    throw new BadRequestError("SmoochApp not found");
  }

  const appId = smoochApp.appId;

  let config: AxiosRequestConfig = {
    method: "get",
    url: `https://api.smooch.io/v1.1/apps/${appId}/integrations`,
    headers: {
      Authorization: `Basic ${new Buffer(
        process.env.SMOOCH_USERNAME + ":" + process.env.SMOOCH_PASSWORD
      ).toString("base64")}`,
      "Content-Type": "application/json",
    },
  };
  try {
    let response = await axios(config);
    let responseData = response.data;
    console.dir("Response data: " + responseData.integrations[0]._id);
    smoochApp.integrationId = responseData.integrations.find(
      (integration: any) => {
        return integration.type === "whatsapp";
      }
    )._id;
    smoochApp.save();
    res.status(201).send(smoochApp);
  } catch (error) {
    const err = error as AxiosError;
    console.error(err.response?.data);
    res.status(400).send(err.response?.data);
  }
});

export { router as refreshIntegrationsRouter };
