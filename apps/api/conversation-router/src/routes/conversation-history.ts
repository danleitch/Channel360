import express, { Request, Response } from "express";
import {
  BadRequestError,
  validateCognitoTokenAndOrganization,
  validateRequest,
} from "@channel360/core";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { SmoochApp } from "@models/smoochApp";
import { AppUser } from "@models/appUser";

const router = express.Router({ mergeParams: true });

router.use(validateRequest, async (req: Request, res: Response) => {
  // Get App User by destinationId.
  const { orgId, destinationId } = req.params;

  const cleanedDestinationId = destinationId.replace(/\+/g, "");

  const appUser = await AppUser.findOne({
    organization: orgId,
    destinationId: cleanedDestinationId,
  });

  if (!appUser) {
    throw new BadRequestError("AppUser not found");
  }

  const smoochApp = await SmoochApp.findOne({
    organization: orgId,
  });

  if (!smoochApp) {
    throw new BadRequestError("SmoochApp not found");
  }

  const appId = smoochApp.appId;

  let config: AxiosRequestConfig = {
    method: "get",
    url: `https://api.smooch.io/v1.1/apps/${appId}/appusers/${appUser.appUser}/conversation`,
    headers: {
      Authorization: `Basic ${new Buffer(
        process.env.SMOOCH_USERNAME + ":" + process.env.SMOOCH_PASSWORD
      ).toString("base64")}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(req.body),
  };

  let response = await axios(config).catch((error: AxiosError) => {
    console.log("Error: ", error);
  });

  res.status(200).send(response?.data);
});

router.get(
  "/api/conversation/history/:orgId/appUser/:appUser",
  validateRequest,
  validateCognitoTokenAndOrganization,
  async (req: Request, res: Response) => {
    const { orgId, appUser } = req.params;

    const smoochApp = await SmoochApp.findOne({
      organization: orgId,
    });

    if (!smoochApp) {
      throw new BadRequestError("SmoochApp not found");
    }

    const appId = smoochApp.appId;
    let config: AxiosRequestConfig = {
      method: "get",
      url: `https://api.smooch.io/v1.1/apps/${appId}/appusers/${appUser}/conversation`,
      headers: {
        Authorization: `Basic ${new Buffer(
          process.env.SMOOCH_USERNAME + ":" + process.env.SMOOCH_PASSWORD
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(req.body),
    };

    let response = await axios(config).catch((error: AxiosError) => {
      console.log("Error: ", error);
    });

    res.status(200).send(response?.data);
  }
);

export { router as conversationHistoryRouter };
