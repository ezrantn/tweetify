import EmailService from "../service/email-service";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { test, describe, vi } from "vitest";

test("EmailService", () => {
  describe("sendEmailToken", () => {
    it("should send email successfully when valid email and token are provided", async () => {
      const emailService = new EmailService();
      const email = "valid@example.com";
      const token = "123456";

      vi.spyOn(emailService, "messageResponse").mockReturnValue(
        "Mocked message",
      );
      vi.spyOn(emailService, "createSendEmailCommand").mockReturnValue(
        new SendEmailCommand({}),
      );
      vi.spyOn(emailService.ses, "send").mockResolvedValue({});

      await expect(
        emailService.sendEmailToken(email, token),
      ).resolves.not.toThrow();
    });

    it("should throw an error if the email address is invalid", async () => {
      const emailService = new EmailService();
      const email = "invalid-email";
      const token = "123456";

      vi.spyOn(emailService, "messageResponse").mockReturnValue(
        "Mocked message",
      );
      vi.spyOn(emailService, "createSendEmailCommand").mockImplementation(
        () => {
          throw new Error("invalid email address");
        },
      );

      await expect(emailService.sendEmailToken(email, token)).rejects.toThrow(
        "invalid email address",
      );
    });
  });
});
