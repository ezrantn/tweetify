import { validate } from "../validation/validation";
import {
  createTweetSchema,
  updateTweetSchema,
} from "../validation/tweet-schema";
import { Tweet } from "../types/tweet-types";
import { ResponseError } from "../error/error";
import { logger } from "../application/logger";
import { Prisma, PrismaClient } from "@prisma/client";

/**
 * Creates a new tweet.
 * @param {Tweet} tweetData - Tweet data to be created.
 * @returns {Promise<Tweet>} The created tweet.
 * @throws {ResponseError} If validation fails or a server error occurs.
 */

class TweetService {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async createTweet(tweetData: Tweet, userId: string): Promise<Tweet> {
    try {
      const { content, image } = validate(createTweetSchema, tweetData);

      if (!content) {
        logger.error("Content is required!");
        throw new ResponseError(404, "Not Found");
      }

      const result = await this.prismaClient.tweet.create({
        data: {
          content,
          image,
          userId: Number(userId),
        },
      });
      return result;
    } catch (error) {
      logger.error("Create tweet error", error);
      throw new ResponseError(500, "Internal Server Error");
    }
  }

  async getAllTweets(): Promise<Tweet[]> {
    try {
      const allTweets = await this.prismaClient.tweet.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      });

      if (allTweets.length === 0) {
        logger.error("No Tweets found.");
        throw new ResponseError(404, "Tweets not found");
      }
      return allTweets;
    } catch (error) {
      logger.error("Get All Tweets Error", error);
      throw new ResponseError(500, "Internal Server Error");
    }
  }

  async getTweetByID(id: string): Promise<Tweet> {
    try {
      const result = await this.prismaClient.tweet.findUnique({
        where: { id: Number(id) },
        include: { user: true },
      });
      if (!result) {
        logger.error("User not Found for ID: ", id);
        throw new ResponseError(404, "Not Found");
      }
      return result;
    } catch (error) {
      logger.error("Error fetching tweet by ID:", error);
      throw new ResponseError(500, "Internal Server Error");
    }
  }

  async updateTweet(id: string, newData: Tweet): Promise<Tweet> {
    try {
      const { content, image, userId } = validate(updateTweetSchema, newData);
      const result = await this.prismaClient.tweet.update({
        where: { id: Number(id) },
        data: {
          content,
          image,
          userId,
        },
      });

      if (!result) {
        logger.error("Tweet not found for ID:", id);
        throw new ResponseError(404, "Tweet Not Found");
      }

      return result;
    } catch (error) {
      logger.error(`Failed to update tweet with ID: ${id}`, error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new ResponseError(400, "Invalid data provided for update");
      }
      throw new ResponseError(500, "Internal Server Error");
    }
  }

  async deleteTweet(id: string): Promise<void> {
    try {
      const deletedTweet = await this.prismaClient.tweet.update({
        where: { id: Number(id) },
        data: {
          deletedAt: new Date(),
        },
      });

      if (!deletedTweet) {
        logger.error("User not found for ID:", id);
        throw new ResponseError(404, "Tweet Not Found");
      }
    } catch (error) {
      logger.error(`Failed to delete user with ID: ${id}`, error);
      throw new ResponseError(500, "Internal Server Error");
    }
  }
}

export default TweetService;
