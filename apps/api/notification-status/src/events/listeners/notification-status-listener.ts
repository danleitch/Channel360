import {
    Subjects,
    NotificationStatusEvent, Listener, NotFoundError
} from "@channel360/core";
import {Notification, NotificationDoc} from "@models/notification";
import {queueNotificationGroupName} from "./queueGroupName";
import {JsMsg, NatsConnection} from "nats";
import {FilterQuery} from "mongoose";
import { UpdateType } from "types/UpdateType";

export class NotificationStatusListener extends Listener<NotificationStatusEvent> {

    readonly subject: Subjects.NotificationStatusCreated = Subjects.NotificationStatusCreated;

    stream = "NOTIFICATION_STATUS";

    durableName = "campaign-notification-status-consumer";

    queueGroupName = queueNotificationGroupName;

    constructor(natsClient: NatsConnection) {
        super(natsClient);
    }

    async onMessage(data: NotificationStatusEvent["data"], msg: JsMsg) {
        console.log("Notification Status Listener Called: ", data.trigger);
        switch (data.trigger) {
            case NotificationTrigger.NOTIFICATION_DELIVERY_CHANNEL:
                await updateNotification(NotificationStatus.DELIVERED_TO_CHANNEL, data, msg)
                break
            case NotificationTrigger.NOTIFICATION_DELIVERY_USER:
                await updateNotification(NotificationStatus.DELIVERED, data, msg)
                break
            case NotificationTrigger.CONVERSATION_READ:
                await updateNotification(NotificationStatus.READ, data, msg)
                break
            case NotificationTrigger.NOTIFICATION_DELIVERY_FAILURE:
                await updateNotification(NotificationStatus.FAILED, data, msg)
                break
            default:
                console.log(data.trigger, "  No Match Found");
                msg.ack();
                break
        }
    }
}

async function updateNotification(status: NotificationStatus, data: NotificationStatusEvent["data"], msg: JsMsg) {
    const filter = NotificationFilter(status, data);
    const update: UpdateType = {
        $set: {
            status: status,
            conversationId: data.matchResult?.conversation!._id,
        },
    };

    if (data.error?.message) {
        update.$set.failure_reason = data.error.message;
    }

    let notification: any = null;
    let retries = 5;
    const initialDelay = 1000; // 1 second

    while (!notification && retries > 0) {
        try {
            if (status == NotificationStatus.READ) {
                notification = await Notification.updateMany(filter, update);
            } else {
                notification = await Notification.findOneAndUpdate(filter, update);
            }
        } catch (error) {
            console.log(`Error updating notification: ${error}`);
            retries--;
            if (retries === 0) {
                console.log("Could not update notification after retries.");
                throw new NotFoundError();
            }
            const delayMs = initialDelay * Math.pow(2, 5 - retries);
            console.log(`Retrying in ${delayMs} ms...`);
            await delay(delayMs);
        }
    }

    if (notification) {
        console.log(`Notification Status Updated to ${data.trigger} for ${notification._id}`);
        return msg.ack();
    }
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


enum NotificationStatus {
    READ = "READ",
    DELIVERED = "DELIVERED",
    FAILED = "FAILED",
    DELIVERED_TO_CHANNEL = "DELIVERED TO CHANNEL"
}

enum NotificationTrigger {
    NOTIFICATION_DELIVERY_CHANNEL = "notification:delivery:channel",
    NOTIFICATION_DELIVERY_USER = "notification:delivery:user",
    CONVERSATION_READ = "conversation:read",
    NOTIFICATION_DELIVERY_FAILURE = "notification:delivery:failure"
}


export function NotificationFilter(status: NotificationStatus, data: NotificationStatusEvent["data"]): FilterQuery<NotificationDoc | undefined> {
    switch (status) {
        case NotificationStatus.DELIVERED_TO_CHANNEL:
            return {
                _id: data.id,
                organization: data.organization,
                status: {$nin: [NotificationStatus.READ, NotificationStatus.DELIVERED]}
            }
        case NotificationStatus.DELIVERED:
            return {
                _id: data.id,
                organization: data.organization,
                status: {$nin: [NotificationStatus.READ]}
            }
        case NotificationStatus.READ:
            return {
                conversationId: data.conversation?._id,
                organization: data.organization
            }
        case NotificationStatus.FAILED:
            return {
                _id: data.id,
                organization: data.organization,
            }
        default:
            return {};
    }
}

export function NotFound(notification: NotificationDoc | null | void) {
    return !notification
}
