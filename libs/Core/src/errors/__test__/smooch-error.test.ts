import { SmoochError } from "../smooch-error";

describe("SmoochError", () => {
  it("should correctly instantiate with the given error object and have a status code of 400", () => {
    const errorInfo = {
      code: "SOME_ERROR_CODE",
      description: "An error occurred",
    };
    const smoochError = new SmoochError(errorInfo);

    expect(smoochError).toBeInstanceOf(SmoochError);
    expect(smoochError.statusCode).toBe(400);
    expect(smoochError.message).toBe(errorInfo.description);
  });

  it("should serialize errors correctly", () => {
    const errorInfo = {
      code: "SOME_ERROR_CODE",
      description: "An error occurred",
    };
    const smoochError = new SmoochError(errorInfo);
    const serializedErrors = smoochError.serializeErrors();

    expect(serializedErrors).toEqual([{ message: errorInfo.description }]);
  });
});
