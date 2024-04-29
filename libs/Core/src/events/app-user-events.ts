import {Subjects} from "./subjects";
import mongoose from "mongoose";

export interface AppUserCreatedEvent {
    subject: Subjects.AppUserCreated;
    data: {
        subscriber: string,
        organization: string,
        appUser: string
    };
}


export interface SubscriberDoc extends mongoose.Document {
    _id: string;
    organization: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    optInStatus: boolean;
    version: number;
}
