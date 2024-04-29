// Define the individual log entry
export type LogEntry = {
  conversationId: string;
  mobileNumber?: string; // Optional as it's not present in all entries
  messageText: string;
  direction: 'inbound' | 'outbound';
  status: string;
  organization: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  id: string;
};

// Define the structure of the 'data' object
export type Data = {
  logs: LogEntry[];
  totalLogs: number;
};

// Define the structure of the 'headers' object
type Headers = {
  [key: string]: string;
};

// Define the structure of the 'config' object
type Config = {
  transitional: {
    silentJSONParsing: boolean;
    forcedJSONParsing: boolean;
    clarifyTimeoutError: boolean;
  };
  adapter: string[];
  transformRequest: Array<null>;
  transformResponse: Array<null>;
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  env: Record<string, unknown>;
  headers: Headers;
  method: string;
  url: string;
};

// Define the overall response structure
export type LogsResponseType = {
  data: Data;
  status: number;
  statusText: string;
  headers: Headers;
  config: Config;
  request: Record<string, unknown>; // Assuming 'request' is an object with unknown structure
};
