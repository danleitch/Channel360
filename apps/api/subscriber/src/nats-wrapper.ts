import { connect, JetStreamClient, NatsConnection, StreamConfig } from "nats";
import { defaultStreamConfiguration } from "@channel360/core";

class NatsWrapper {
  private _client?: NatsConnection;
  private _jsClient?: JetStreamClient;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  get jsClient() {
    if (!this._jsClient) {
      throw new Error(
        "Cannot access JetStream client before connecting and enabling JetStream"
      );
    }

    return this._jsClient;
  }

  async connect(
    clientId: string,
    url: string,
    retryAttempts = 3,
    retryDelayMs = 1000
  ) {
    console.log("Attempting to connect to Nats server on " + url);

    let retryCount = 0;
    let connected = false;

    while (retryCount < retryAttempts && !connected) {
      try {
        this._client = await connect({
          servers: url,
          name: clientId,
          user: "user_MooDW5nt",
          pass: "QPkiRc3T",
        });
        if (this._client) console.log("Connected to NATS JetStream");
        connected = true;
      } catch (error) {
        if (error instanceof Error) {
          // Type assertion using instanceof
          console.error(
            `Failed to connect to NATS JetStream: ${error.message}`
          );
        } else {
          console.error(`Failed to connect to NATS JetStream: ${error}`);
        }
        retryCount++;
        if (retryCount < retryAttempts) {
          console.log(
            `Retrying connection in ${retryDelayMs / 1000} seconds...`
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        } else {
          console.error(`Exceeded maximum retry attempts. Connection failed.`);
          throw error;
        }
      }
    }

    if (this._client)
      if (connected) {
        const maxRetries = 3;
        const retryDelay = 5000; // 1000ms delay
        let retries = 0;
        let jsm = null;

        while (retries < maxRetries) {
          try {
            jsm = await this._client.jetstreamManager();
            break;
          } catch (error) {
            console.log(
              `Failed to initialize JetStream Manager. Retrying... (${
                retries + 1
              }/${maxRetries})`
            );
            retries++;
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }

        if (!jsm) {
          console.log(
            "Failed to initialize JetStream Manager after multiple attempts."
          );
          return;
        }

        console.log("Initialized JetStream Manager");
        // Enable JetStream
        this._jsClient = this._client.jetstream();
        console.log("Initialized JetStream Client");

        // <!--- Add Stream --->

        const groupStreamConfig: StreamConfig = {
          ...defaultStreamConfiguration,
          name: "GROUP",
          subjects: ["group:created", "group:updated", "group:deleted"],
        };

        // <!--- End Adding Stream --->

        if (
          typeof jsm === "object" &&
          Object.prototype.hasOwnProperty.call(jsm, "streams")
        ) {
          await jsm.streams.add(groupStreamConfig).catch((e) => console.log(e));
        }

        console.log("Adding NATS JetStream");

        this._client.closed().then((err) => {
          if (err) {
            console.error(`Connection closed with error: ${err.message}`);
          } else {
            console.log("Connection closed");
            process.exit();
          }
        });
      }
  }
}

export const natsWrapper = new NatsWrapper();
