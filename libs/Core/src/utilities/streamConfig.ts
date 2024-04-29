import { RetentionPolicy, StorageType, StreamConfig } from "nats";

// @ts-ignore
export const defaultStreamConfiguration: StreamConfig = {
  allow_direct: true,
  max_age: 0,
  max_consumers: -1,
  max_msg_size: -1,
  max_bytes: -1,
  num_replicas: 1,
  storage: StorageType.File,
  retention: RetentionPolicy.Workqueue,
  max_msgs: -1
};
