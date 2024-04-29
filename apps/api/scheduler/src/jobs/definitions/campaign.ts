import Agenda from "agenda";
import { JobHandlers } from "@handlers/handlers";

export const campaignDefinitions = (agenda: Agenda) => {
  agenda.define("send campaign", JobHandlers.sendCampaign);
};

