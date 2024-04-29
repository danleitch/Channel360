import { CustomerResponseEvent, Publisher, Subjects } from "@channel360/core";


/**
 * @class CustomerResponsePublisher
 * @extends Publisher
 * @description This class is used to publish the customer response to the queue
 */
export class CustomerResponsePublisher extends Publisher<CustomerResponseEvent> {
  subject: Subjects.CustomerResponseCreated = Subjects.CustomerResponseCreated;
}
