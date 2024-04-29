import axios from 'axios';
import { Request } from 'express';
import { BadRequestError } from '@channel360/core'; // Replace with your actual error library

export let subscriberService = async (req: Request, subscriberGroup: string, organizationId: string) => {
    try {
        const url = req.protocol + '://' + req.get('host');
        console.log("url", `${url}/api/group/${organizationId}/${subscriberGroup}/subscribers?all=true`);
        console.log("Headers", { headers: { Authorization: req.headers.authorization } });

        const response = await axios.get(`${url}/api/group/${organizationId}/${subscriberGroup}/subscribers?all=true`, {
            headers: { Authorization: req.headers.authorization! }
        });

        return response.data.subscribers;
    } catch (error:any) {
        if (axios.isAxiosError(error)) {
            // @ts-ignore
            throw new BadRequestError(error.response?.data || 'Request failed');
        } else {
            throw new BadRequestError('An error occurred while processing the request');
        }
    }
};
