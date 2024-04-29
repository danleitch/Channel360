import express, { Request, Response } from "express";
import { BadRequestError } from "@channel360/core";
import { body } from "express-validator";
import axios from "axios";
import { Organization } from "@models/organization";
import { SmoochApp } from "@models/smoochApp";

const router = express.Router({ mergeParams: true });

/**
 * @Todo rename route to /v1.1/api/reply/:orgId/appuser/:authorId/messages
 */
router.use(
  [body("text").not().isEmpty().withMessage("text is required")],
  async (req: Request, res: Response) => {
    const { text } = req.body;
    const { orgId, authorId } = req.params;
    const organization = await Organization.findById(orgId);
    if (!organization) {
      throw new BadRequestError("Organization not found");
    }

    const smoochApp: any = await SmoochApp.findOne({
      organization: organization.id,
    });
    if (!smoochApp || !smoochApp.integrationId) {
      throw new BadRequestError("Not valid smooch details");
    }

    const appId = smoochApp.appId;

    const httpData = JSON.stringify({
      role: "appMaker",
      text,
      type: "text",
    });

    const response = await axios({
      method: "post",
      url: `https://api.smooch.io/v1.1/apps/${appId}/appusers/${authorId}/messages`,
      headers: {
        Authorization: `Basic ${new Buffer(
          process.env.SMOOCH_USERNAME + ":" + process.env.SMOOCH_PASSWORD
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      data: httpData,
    });

    res.status(201).send(response.data);
  }
);

export { router as replyRouter };
