import { sendEmailToken } from "./email-service";
import { prismaClient } from "../application/database";
import { generateAuthToken, generateEmailToken } from "../application/utils";
import {
  EMAIL_TOKEN_EXPIRATION_MINUTES,
  AUTHENTICATION_EXPIRATION_HOURS,
} from "../application/utils";
import { validate } from "../validation/validation";
import { authSchema, emailSchema } from "../validation/auth-schema";
import { logger } from "../application/logger";
import { ResponseError } from "../error/error";

export const AuthenticationService = {
  login: async (email: string) => {
    validate(emailSchema, { email });
    const emailToken = generateEmailToken();
    const expiration = new Date(
      new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000,
    );
    try {
      await prismaClient.token.create({
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

      await sendEmailToken(email, emailToken);
      return true;
    } catch (error) {
      logger.error("Failed to create token:", error);
      throw new ResponseError(500, "Failed to create token");
    }
  },

  authenticate: async (email: string, emailToken: string) => {
    validate(authSchema, { email, emailToken });
    const dbEmailToken = await prismaClient.token.findUnique({
      where: {
        emailToken,
      },
      include: {
        user: true,
      },
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
      new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000,
    );

    const apiToken = await prismaClient.token.create({
      data: {
        type: "API",
        expiration,
        user: {
          connect: {
            email,
          },
        },
      },
    });

    await prismaClient.token.update({
      where: { id: dbEmailToken.id },
      data: { valid: false },
    });

    return generateAuthToken(apiToken.id);
  },
};
