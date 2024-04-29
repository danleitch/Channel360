import axios from "axios";
import { Request } from "express";

export const subscriberService = async (
  req: Request,
  subscriberGroup: string,
  organizationId: string
) => {
  const url = req.protocol + "://" + req.get("host");
  const response = await axios.get(
    `${url}/webapi/org/${organizationId}/groups/${subscriberGroup}/subscribers?all=true`,
    {
      headers: { Authorization: req.headers.authorization! },
    }
  );

  return response.data.subscribers;
};
