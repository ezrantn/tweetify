import { sendEmailToken } from "../service/email-service";
import { prismaClient } from "../application/database";
import z from "zod";
import { generateAuthToken, generateEmailToken } from "../application/utils";
import {
  EMAIL_TOKEN_EXPIRATION_MINUTES,
  AUTHENTICATION_EXPIRATION_HOURS,
  router,
} from "../application/utils";
import { validate } from "../validation/validation";
import { authSchema, emailSchema } from "../validation/auth-schema";

router.post("/login", async (req, res) => {
  const { email } = validate(emailSchema, req.body);

  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
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
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error: "Failed to create token" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, emailToken } = validate(authSchema, req.body);

  const dbEmailToken = await prismaClient.token.findUnique({
    where: {
      emailToken,
    },
    include: {
      user: true,
    },
  });

  if (!dbEmailToken || !dbEmailToken.valid) {
    return res.sendStatus(401);
  }

  if (dbEmailToken.expiration < new Date()) {
    return res.status(401).json({ error: "Token expired!" });
  }

  if (dbEmailToken?.user?.email !== email) {
    return res.sendStatus(401);
  }

  const expiration = new Date(
    new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
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

  // generate the JWT token
  const authToken = generateAuthToken(apiToken.id);

  res.json({ authToken });
});

export default router;
