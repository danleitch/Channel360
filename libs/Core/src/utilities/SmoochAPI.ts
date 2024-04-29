import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { SmoochError } from "../errors/smooch-error";

export class SmoochAPI {
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(appId: string) {
    this.baseUrl = `https://api.smooch.io/v1.1/apps/${appId}`;
    this.authHeader = `Basic ${Buffer.from(
      `${process.env["SMOOCH_USERNAME"]!}:${process.env["SMOOCH_PASSWORD"]}`,
    ).toString("base64")}`;
  }

  private createConfig(
    customHeaders?: Record<string, string>,
  ): AxiosRequestConfig {
    const headers: Record<string, string> = {
      Authorization: this.authHeader,
      "Content-Type": "application/json",
      ...customHeaders,
    };

    return {
      headers,
    };
  }

  public async makeGetRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.createConfig();
    try {
      const response: AxiosResponse<T> = await axios.get<T>(url, headers);
      return response as T;
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        throw new SmoochError(error.response.data.error);
      } else {
        throw new SmoochError({
          code: "UNEXPECTED_ERROR",
          description: "An unexpected error occurred",
        });
      }
    }
  }

  public async makePostRequest<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.createConfig();

    try {
      const response: AxiosResponse<T> = await axios.post(url, data, headers);
      return response as T;
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        throw new SmoochError(error.response.data.error);
      } else {
        throw new SmoochError({
          code: "UNEXPECTED_ERROR",
          description: "An unexpected error occurred",
        });
      }
    }
  }
}
