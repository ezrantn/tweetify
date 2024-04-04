import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email().max(100).min(3),
});

const authSchema = z.object({
  email: z.string().email().max(100).min(3),
  emailToken: z.string().max(100).min(5),
});

export { emailSchema, authSchema };
