import { z } from "zod";
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const userSchema = z.object({
  email: z.string().email().max(100).min(3),
  name: z.string().min(1).trim(),
  username: z.string().min(3).trim(),
});

const updateUserSchema = z.object({
  bio: z.string().optional(),
  name: z.string().min(1).trim(),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
  username: z.string().min(3).trim(),
  email: z.string().email().max(100).min(3),
});

export { userSchema, updateUserSchema };
