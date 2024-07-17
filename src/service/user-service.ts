import { Prisma, PrismaClient } from "@prisma/client";
import { validate } from "../validation/validation";
import { updateUserSchema, userSchema } from "../validation/user-schema";
import { ResponseError } from "../error/error";
import { User } from "../types/user-types";
import { logger } from "../application/logger";
import FileUploadService from "./file-upload-service";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { prismaClient } from "../application/database";

/**
 * Creates a new user.
 * @param {User} userData - User data to be created.
 * @returns {Promise<User>} The created user.
 * @throws {ResponseError} If validation fails or a server error occurs.
 */

class UserService {
  private s3Client: S3Client;
  private fileUploadService: FileUploadService;

  constructor() {
    this.s3Client = new S3Client();
    this.fileUploadService = new FileUploadService();
  }

  async createUser(userData: User): Promise<User> {
    try {
      const { email, name, username } = validate(userSchema, userData);

      if (!email || !name || !username) {
        logger.error("Missing fields when creating an account");
        throw new ResponseError(400, "Bad Request");
      }

      return await prismaClient.user.create({
        data: {
          email,
          name,
          username,
          bio: "Hello, I'm new on Twitter",
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        logger.error("Prisma Error:", error);
        throw new ResponseError(400, "Username already exist");
      }
      logger.error("Failed to create user:", error);
      throw new ResponseError(500, "Internal Server Error");
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const allUser = await prismaClient.user.findMany();

      if (allUser.length === 0) {
        throw new ResponseError(404, "No users found");
      }

      return allUser;
    } catch (error) {
      logger.error("Failed to fetch all users:", error);
      throw new ResponseError(500, "Failed to fetch users");
    }
  }

  async getUserByID(id: string): Promise<{ user: User | null }> {
    try {
      const user = await prismaClient.user.findUnique({
        where: { id: Number(id) },
        include: { tweets: true },
      });

      if (!user) {
        logger.error("User not Found for ID: ", id);
        throw new ResponseError(404, "User not found!");
      }

      return { user };
    } catch (error) {
      logger.error("Error fetching user by ID:", error);
      throw new ResponseError(
        500,
        "An error occurred while fetching the user. Please try again later.",
      );
    }
  }

  async updateUser(id: string, newUser: User): Promise<User> {
    try {
      const { bio, name, image, username, email } = validate(
        updateUserSchema,
        newUser,
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

      if (!result) {
        logger.error("User not found for ID:", id);
        throw new ResponseError(404, "User not found");
      }
      return result;
    } catch (error) {
      logger.error(`Failed to update user with ID: ${id}`, error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new ResponseError(400, "Invalid data provided for update");
      } else {
        throw new ResponseError(500, "Internal Server Error");
      }
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const deletedUser = await prismaClient.user.update({
        where: { id: Number(id) },
        data: {
          deletedAt: new Date(),
        },
      });

      if (!deletedUser) {
        logger.error("User not found for ID:", id);
        throw new ResponseError(404, "User not found");
      }
    } catch (error) {
      logger.error(`Failed to delete user with ID: ${id}`, error);
      throw new ResponseError(500, "Internal Server Error");
    }
  }

  async searchUserBasedOnUsername(usernameParam: string): Promise<User> {
    try {
      const userName = await prismaClient.user.findMany({
        where: {
          username: {
            equals: usernameParam,
            mode: "insensitive",
          },
        },
        include: { tweets: true },
      });

      if (!userName) {
        logger.error("User not found for username:", usernameParam);
        throw new ResponseError(404, "User not found!");
      }

      return userName[0];
    } catch (error) {
      logger.error(
        `Failed to get a user with username: ${usernameParam}`,
        error,
      );
      throw new ResponseError(500, "Internal Server Error");
    }
  }

  async uploadAvatar(id: string, signedUrl: string): Promise<User> {
    try {
      const userId = Number(id);
      return await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          image: signedUrl,
        },
      });
    } catch (error) {
      logger.error(`Failed to upload avatar user with ID: ${id}`, error);
      console.log("error dari service", error);
      throw new ResponseError(500, "Internal Server Error");
    }
  }

  async deleteAvatar(id: string): Promise<void> {
    try {
      const avatarUnique = await prismaClient.user.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!avatarUnique) {
        throw new ResponseError(404, "User not found");
      }

      if (!avatarUnique.image) {
        throw new ResponseError(404, "Image not found");
      }

      const deleteParam = {
        Bucket: this.fileUploadService.getBucketName(),
        Key: avatarUnique.image,
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParam));

      await prismaClient.user.update({
        where: {
          id: Number(id),
        },
        data: {
          image: null,
        },
      });
    } catch (error) {
      logger.error(`Failed to delete image with ID: ${id}`, error);
      throw new ResponseError(500, "Internal Server Error");
    }
  }
}

export default UserService;
