import axios from 'axios';
import { SmoochAPI } from "../SmoochAPI";
import { SmoochError } from "../../errors/smooch-error";

// Mock the entire Axios module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SmoochAPI Error Handling', () => {
  const appId = 'testAppId';
  const smoochApi = new SmoochAPI(appId);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw SmoochError with correct message on GET request failure', async () => {
    const errorMessage = {
      response: {
        data: {
          error: {
            code: 'SOME_ERROR_CODE',
            description: 'An error occurred',
          },
        },
      },
    };

    // Simulate Axios throwing an error on GET
    mockedAxios.get.mockRejectedValue(errorMessage);

    await expect(smoochApi.makeGetRequest('/test-endpoint')).rejects.toThrow(SmoochError);
    await expect(smoochApi.makeGetRequest('/test-endpoint')).rejects.toHaveProperty('message', errorMessage.response.data.error.description);
  });

  it('should throw SmoochError with correct message on POST request failure', async () => {
    const errorMessage = {
      response: {
        data: {
          error: {
            code: 'ANOTHER_ERROR_CODE',
            description: 'Another error occurred',
          },
        },
      },
    };

    // Simulate Axios throwing an error on POST
    mockedAxios.post.mockRejectedValue(errorMessage);

    await expect(smoochApi.makePostRequest('/test-endpoint', {})).rejects.toThrow(SmoochError);
    await expect(smoochApi.makePostRequest('/test-endpoint', {})).rejects.toHaveProperty('message', errorMessage.response.data.error.description);
  });
});
