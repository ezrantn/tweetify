import { z } from "zod";

const userSchema = z.object({
  email: z.string().email().max(100).min(3),
  name: z.string().min(1).trim(),
  username: z.string().min(3).trim(),
});

const updateUserSchema = z.object({
  bio: z.string().optional(),
  name: z.string().min(1).trim(),
  image: z.string().optional(),
  username: z.string().min(3).trim(),
  email: z.string().email().max(100).min(3),
});

export { userSchema, updateUserSchema };
