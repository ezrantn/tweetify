import { prismaClient } from "../application/database";
import { generateEmailToken } from "../application/utils";
import { ResponseError } from "../error/error";
import { AuthenticationService } from "../service/auth-service";
import { sendEmailToken } from "../service/email-service";

jest.mock("../service/email-service");
jest.mock("../application/utils");
jest.mock("../validation/validation");
jest.mock("../validation/auth-schema");
jest.mock("../application/logger");
jest.mock("../error/error");

jest.mock("../application/database", () => ({
  prismaClient: {
    token: {
      create: jest.fn().mockResolvedValue({
        id: 1,
        type: "EMAIL",
        emailToken: "12345",
        expiration: new Date(new Date().getTime() + 30 * 60 * 1000),
        user: { email: "user@example.com" },
      }),
    },
  },
}));

describe("Authentication Service", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    setupMocks();
  });

  const setupMocks = () => {
    generateEmailToken.mockReturnValue("12345");
    sendEmailToken.mockResolvedValue(true);
  };

  it("login should create an email token and send it to the user", async () => {
    const email = "user@example.com";
    await AuthenticationService.login(email);

    expect(prismaClient.token.create).toHaveBeenCalledTimes(1);
    expect(prismaClient.token.create).toHaveBeenCalledWith({
      data: {
        type: "EMAIL",
        emailToken: "12345",
        expiration: expect.any(Date),
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });

    expect(sendEmailToken).toHaveBeenCalledTimes(1);
    expect(sendEmailToken).toHaveBeenCalledWith(email, "12345");
  });

  it("login should throw an error if token creation fails", async () => {
    const email = "user@example.com";

    prismaClient.token.create.mockRejectedValue(
      new Error("token creation failed"),
    );

    await expect(AuthenticationService.login(email)).rejects.toThrow(
      new ResponseError(500, "Failed to create token"),
    );
  });
});
