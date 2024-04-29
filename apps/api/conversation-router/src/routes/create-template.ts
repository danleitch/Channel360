import express, { Request, Response } from "express";
import {
  BadRequestError,
  ModelFinder,
  SmoochAPI,
  TemplateTagValidator,
  validateRequest,
} from "@channel360/core";
import { SmoochApp } from "@models/smoochApp";
import { WhatsappTemplateCreatedPublisher } from "@publishers/whatsapp-template-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { CREATE_TEMPLATE_VALIDATOR } from "@validations/CREATE_TEMPLATE_VALIDATOR";

interface ResponseSmoochWhatsappTemplate {
  status: string;
  data: {
    messageTemplate: {
      category: string;
      id: string;
      status: string;
    };
  };
}

const router = express.Router({ mergeParams: true });
router.use(
  CREATE_TEMPLATE_VALIDATOR,
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      description,
      namespace,
      enabled,
      language,
      category,
      components,
      tags,
    } = req.body;

    const organization = req.params.orgId;

    /**
     * Validating Templates 🔎📜
     */

    if (tags) {
      const templateValidator = new TemplateTagValidator();

      const { validTemplate, errors } =
        templateValidator.validateTemplateTags(tags);

      if (!validTemplate) {
        throw new BadRequestError(errors.join(","));
      }
    }

    /**
     * Get Smooch Connection
     */

    const smoochApp = await ModelFinder.findOneOrFail(
      SmoochApp,
      {
        organization,
      },
      "Organization is not connected to Whatsapp",
    );

    const { appId, integrationId } = smoochApp;

    const smoochApiClient = new SmoochAPI(appId);

    /**
     * Create Whatsapp Template
     */

    const { data } =
      await smoochApiClient.makePostRequest<ResponseSmoochWhatsappTemplate>(
        `/integrations/${integrationId}/messageTemplates`,
        JSON.stringify({
          category: category,
          name: name,
          language: language,
          components: components,
        }),
      );

    const { messageTemplate } = data;

    console.log(
      `AppId: ${{ appId }} - IntegrationId ${{ integrationId }}`,
      "Creating WhatsApp Template with:  ",
      JSON.stringify(messageTemplate),
    );

    /**
     * Send off to templates service
     * @Todo - Move this functionality to the templates service
     */

    await new WhatsappTemplateCreatedPublisher(natsWrapper.client).publish({
      name,
      tags,
      enabled,
      language,
      namespace,
      components,
      description,
      organization,
      status: messageTemplate.status,
      category: messageTemplate.category,
      messageTemplateId: messageTemplate.id,
    });

    res
      .status(201)
      .send({ message: `Template ${name} has been created successfully` });
  },
);

export { router as newTemplatesRouter };
