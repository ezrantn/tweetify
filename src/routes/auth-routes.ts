import { sendEmailToken } from "../services/emailService";
import { prismaClient } from "../prisma-client";
import z from "zod";
import { generateAuthToken, generateEmailToken } from "../utils";
import {
  EMAIL_TOKEN_EXPIRATION_MINUTES,
  AUTHENTICATION_EXPIRATION_HOURS,
  router
} from "../utils";

router.post("/login", async (req, res) => {
  const emailSchema = z.string().email().max(100).min(3);
  const email = emailSchema.parse(req.body);

  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );
  try {
    const createdToken = await prismaClient.token.create({
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
  const authSchema = z.object({
    email: z.string().email().max(100).min(3),
    emailToken: z.string().max(100).min(5),
  });
  const { email, emailToken } = authSchema.parse(req.body);

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
