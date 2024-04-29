import request from "supertest";
import ApiKeyRepository from "@repositories/ApiKeyRepository";
import { app } from "app";
import { APIKeyDoc } from "@models/api-key";
import mocked = jest.mocked;

jest.mock("@repositories/ApiKeyRepository");

const mockedApiKeyRepository = mocked(ApiKeyRepository, true);

describe("ApiController", () => {
  describe("GET /api/keys/:orgId", () => {
    it("should return a list of API keys with truncated values", async () => {
      const mockedApiKeys = [
        {
          id: "1",
          organization: "org1",
          apiKey: "#fqsci9j8aj63ripf2s!4j#xf!^rbz!f@@5!*5$gn#i93j7",
          revoked: false,
        },
        {
          id: "2",
          organization: "org1",
          apiKey: "^smbz2^z6rb8aztqjy#t95zwah4iifw5*c",
          revoked: false,
        },
      ] as APIKeyDoc[];

      mockedApiKeyRepository.list.mockResolvedValue(mockedApiKeys);

      const response = await request(app).get("/webapi/org/org1/token");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });
});
