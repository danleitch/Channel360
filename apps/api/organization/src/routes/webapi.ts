import { Router } from "express";
import { indexOrganizationReportRouter } from "@routes/reports/metrics";
import { updateSettingsRouter } from "@routes/settings/update";
import { getSettingsRouter } from "@routes/settings/get";
import { deleteApiKeyRouter } from "@routes/api-key/delete";
import { createApiKeyRouter } from "@routes/api-key/new";
import { getApiKeyRouter } from "@routes/api-key/get";
import { listApiKeyRouter } from "@routes/api-key/list";

const webapiRouter = Router({ mergeParams: true });
/**
 * Organization
 * /webapi/org/:orgId/token
 */
webapiRouter.post("/token", createApiKeyRouter);
webapiRouter.delete("/token/:id", deleteApiKeyRouter);
webapiRouter.get("/token/:id", getApiKeyRouter);
webapiRouter.get("/token", listApiKeyRouter);
/**
 * Organization
 * /webapi/org/:orgId/organization
 * @Todo: change this to just be /reports
 */
webapiRouter.post("/organization/reports", indexOrganizationReportRouter);
/**
 * Organization
 * /webapi/org/:orgId/settings
 */
webapiRouter.put("/settings", updateSettingsRouter);
webapiRouter.get("/settings", getSettingsRouter);


export default webapiRouter