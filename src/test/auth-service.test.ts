import AuthenticationService from "../service/auth-service";
import { ResponseError } from "../error/error";
import { test, describe, vi } from "vitest";

vi.mock("../service/email-service.ts");
vi.mock("../application/utils.ts");
vi.mock("../application/database.ts");

test("AuthenticationService", () => {
  describe("login service", () => {
    it("should return true when valid email is provided and token is successfully created and sent", async () => {
      const authService = new AuthenticationService();
      const email = "valid@example.com";

      vi.spyOn(authService["helper"], "generateEmailToken").mockReturnValue(
        "12345678",
      );
      vi.spyOn(
        authService["helper"],
        "getEmailTokenExpirationMinutes",
      ).mockReturnValue(10);
      vi.spyOn(authService["prismaClient"].token, "create").mockResolvedValue(
        {},
      );
      vi.spyOn(
        authService["emailService"],
        "sendEmailToken",
      ).mockResolvedValue();

      const result = await authService.login(email);

      expect(result).toBe(true);
    });

    it("should throw ResponseError when email is invalid", async () => {
      const authService = new AuthenticationService();
      const email = "invalid-email";

      await expect(authService.login(email)).rejects.toThrow(ResponseError);
    });
  });

  describe("authentication service", () => {
    it("should return auth token when email and emailToken are valid", async () => {
      const authService = new AuthenticationService();
      const email = "example@example.com";
      const emailToken = "123456";

      vi.spyOn(authService.prismaClient.token, "findUnique").mockResolvedValue({
        emailToken,
        valid: true,
        expiration: new Date(Date.now() + 10000),
        user: { email },
      });

      vi.spyOn(authService.prismaClient.token, "create").mockResolvedValue({
        id: 1,
      });
      vi.spyOn(authService.prismaClient.token, "update").mockResolvedValue({});
      vi.spyOn(authService.helper, "generateAuthToken").mockReturnValue(
        "auth-token",
      );

      const authToken = await authService.authenticate(email, emailToken);

      expect(authToken).toBe("auth-token");
    });

    it("should throw 400 ResponseError when email token is invalid", async () => {
      const authService = new AuthenticationService();
      const email = "example@example.com";
      const emailToken = "invalid-token";

      vi.spyOn(authService.prismaClient.token, "findUnique").mockResolvedValue(
        null,
      );

      await expect(authService.authenticate(email, emailToken)).rejects.toThrow(
        ResponseError,
      );
      await expect(authService.authenticate(email, emailToken)).rejects.toThrow(
        "Invalid email token",
      );
    });
  });
});
