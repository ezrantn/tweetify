import { ZodError, ZodSchema } from "zod";
import { ResponseError } from "../error/error";

const validate = <T>(schema: ZodSchema<T>, request: unknown): T => {
  try {
    return schema.parse(request);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ResponseError(400, error.message);
    }
    throw error;
  }
};

export { validate };
