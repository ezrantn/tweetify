import { z } from "zod";

const createTweetSchema = z.object({
  content: z.string().min(3),
  image: z.string().optional(),
});

const updateTweetSchema = z.object({
    content: z.string().min(3),
    image: z.string().optional(),
    userId: z.number(),
  });

export { createTweetSchema, updateTweetSchema }
