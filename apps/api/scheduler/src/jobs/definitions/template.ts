import Agenda from "agenda";
import { JobHandlers } from "@handlers/handlers";

export const templateDefinitions = (agenda: Agenda) => {
  agenda.define("sync templates", JobHandlers.syncTemplates);
};