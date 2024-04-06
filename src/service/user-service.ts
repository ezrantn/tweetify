import { Prisma } from "@prisma/client";
import { prismaClient } from "../application/database";
import { validate } from "../validation/validation";
import { updateUserSchema, userSchema } from "../validation/user-schema";
import { ResponseError } from "../error/error";
import { User } from "../types/user-types";
import { Tweet } from "../types/tweet-types";

const createUser = async (userData: User): Promise<User> => {
  try {
    const { email, name, username } = validate(userSchema, userData);

    if (!email || !name || !username) {
      throw new ResponseError(400, "Bad Request");
    }

    const result = await prismaClient.user.create({
      data: {
        email,
        name,
        username,
        bio: "Hello, I'm new on Twitter",
      },
    });
    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ResponseError(400, "Username already exist");
    }

    throw error;
  }
};

const getAllUsers = async (): Promise<User[]> => {
  try {
    const allUser = await prismaClient.user.findMany();

    if (allUser.length === 0) {
      throw new ResponseError(404, "No users found");
    }

    return allUser;
  } catch (error) {
    throw error;
  }
};

const getUserByID = async (
  id: string
): Promise<{ user: User | null; tweet: Tweet[] | null }> => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: Number(id) },
      include: { tweets: true },
    });

    if (!user) {
      return { user: null, tweet: null };
    }

    return { user, tweet: user.tweets };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new ResponseError(
      500,
      "An error occurred while fetching the user. Please try again later."
    );
  }
};

const updateUser = async (id: string, newUser: User): Promise<User> => {
  try {
    const { bio, name, image, username, email } = validate(
      updateUserSchema,
      newUser
    );
    const result = await prismaClient.user.update({
      where: { id: Number(id) },
      data: {
        bio,
        name,
        image,
        username,
        email,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id: string): Promise<User> => {
  try {
    const deletedUser = await prismaClient.user.delete({
      where: { id: Number(id) },
    });
    return deletedUser;
  } catch (error) {
    throw error;
  }
};

export default { createUser, getAllUsers, getUserByID, updateUser, deleteUser };
