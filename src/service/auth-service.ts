import EmailService from "./email-service";
import Helper from "../application/utils";
import { validate } from "../validation/validation";
import { authSchema, emailSchema } from "../validation/auth-schema";
import { logger } from "../application/logger";
import { ResponseError } from "../error/error";
import { PrismaClient } from "@prisma/client";

class AuthenticationService {
  private emailService: EmailService;
  private prismaClient: PrismaClient;
  private helper: Helper;

  constructor() {
    this.emailService = new EmailService();
    this.helper = new Helper();
    this.prismaClient = new PrismaClient();
  }

  async login(email: string) {
    validate(emailSchema, { email });

    const emailToken = this.helper.generateEmailToken();
    const expiration = new Date(
      Date.now() + this.helper.getEmailTokenExpirationMinutes() * 60 * 1000,
    );

    try {
      await this.prismaClient.token.create({
        data: {
          type: "EMAIL",
          emailToken,
          expiration,
          user: {
            connectOrCreate: {
              where: { email },
              create: { email },
            },
          },
        },
      });

      await this.emailService.sendEmailToken(email, emailToken);
      return true;
    } catch (error) {
      logger.error("Failed to create token:", error);
      throw new ResponseError(500, "Failed to create token");
    }
  }

  async authenticate(email: string, emailToken: string) {
    validate(authSchema, { email, emailToken });

    const dbEmailToken = await this.prismaClient.token.findUnique({
      where: { emailToken },
      include: { user: true },
    });

    if (!dbEmailToken || !dbEmailToken.valid) {
      throw new ResponseError(400, "Invalid email token");
    }

    if (dbEmailToken.expiration < new Date()) {
      throw new ResponseError(401, "Token expired");
    }

    if (dbEmailToken.user.email !== email) {
      throw new ResponseError(401, "Email does not match");
    }

    const expiration = new Date(
      Date.now() +
        this.helper.getAuthenticationExpirationHours() * 60 * 60 * 1000,
    );

    const apiToken = await this.prismaClient.token.create({
      data: {
        type: "API",
        expiration,
        user: { connect: { email } },
      },
    });

    await this.prismaClient.token.update({
      where: { id: dbEmailToken.id },
      data: { valid: false },
    });

    return this.helper.generateAuthToken(apiToken.id);
  }
}

export default AuthenticationService;
