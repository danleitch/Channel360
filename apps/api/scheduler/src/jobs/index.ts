import Agenda from "agenda";
import { campaignDefinitions } from "@definitions/campaign";
import { templateDefinitions } from "@definitions/template";

const agenda = new Agenda({
  db: { address: "mongodb://scheduler-mongo-srv:27017/scheduler" },
});

const definitions = [campaignDefinitions,templateDefinitions];

const allDefinitions = (agenda: Agenda) => {
  definitions.forEach((definition) => definition(agenda));
};

allDefinitions(agenda);

export default agenda;
