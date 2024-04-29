import {AppUser} from "@models/appUser";
import {BadRequestError} from "@channel360/core";
import {DeliveryData} from "@interfaces/DeliveryData";

export class AppUserManager {
    protected matchResult: any;
    protected conversation: any;

    constructor(protected data: DeliveryData, protected orgId: string) {
        this.matchResult = data.matchResult;
        this.conversation = data.conversation;
    }

    create() {
        AppUser.findOneAndUpdate({
            appUser: this.matchResult.appUser._id,
            organization: this.orgId,
        }, {
            destinationId: this.data.destination!.destinationId
        }, {upsert: true}).catch((err) => {
            console.error(err);
            throw new BadRequestError("Error AppUser")
        });
    }

}
