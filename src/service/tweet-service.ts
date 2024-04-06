import { Request } from "express";
import { prismaClient } from "../application/database";
import { validate } from "../validation/validation";
import {
  createTweetSchema,
  updateTweetSchema,
} from "../validation/tweet-schema";
import { Tweet } from "../types/tweet-types";
import { ResponseError } from "../error/error";

const createTweet = async (tweetData: Tweet, userId: string): Promise<Tweet> => {
  const { content, image } = validate(createTweetSchema, tweetData);

  if (!content) {
    throw new ResponseError(404, "Not Found");
  }

  try {
    const result = await prismaClient.tweet.create({
      data: {
        content,
        image,
        userId: Number(userId)
      },
    });
    return result;
  } catch (error) {
    throw new ResponseError(500, "Internal Server Error");
  }
};

const getAllTweets = async (): Promise<Tweet[]> => {
  try {
    const allTweets = await prismaClient.tweet.findMany({
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
      throw new ResponseError(404, "Tweets not found");
    }
    return allTweets;
  } catch (error) {
    throw new ResponseError(500, "Internal Server Error");
  }
};

const getTweetByID = async (id: string): Promise<Tweet> => {
  if (!id || parseInt(id) <= 0) {
    throw new ResponseError(400, "Bad Request");
  }
  try {
    const result = await prismaClient.tweet.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });
    if (!result) {
      throw new ResponseError(404, "Not Found");
    }
    return result;
  } catch (error) {
    throw new ResponseError(500, "Internal Server Error");
  }
};

const updateTweet = async (id: string, newData: Tweet): Promise<Tweet> => {
  const { content, image, userId } = validate(updateTweetSchema, newData);

  if (!id || parseInt(id) <= 0) {
    throw new ResponseError(400, "Bad Request");
  }

  if (!content) {
    throw new ResponseError(404, "Content Not Found");
  }

  try {
    const result = await prismaClient.tweet.update({
      where: { id: Number(id) },
      data: {
        content,
        image,
        userId,
      },
    });
    return result;
  } catch (error) {
    throw new ResponseError(500, "Internal Server Error");
  }
};

const deleteTweet = async (id: string): Promise<Tweet> => {
  if (!id || parseInt(id) <= 0) {
    throw new ResponseError(400, "Bad Request");
  }

  try {
    const deletedTweet = await prismaClient.tweet.delete({
      where: { id: Number(id) },
    });

    if (!deletedTweet) {
      throw new ResponseError(404, "Tweet Not Found");
    }

    return deletedTweet;
  } catch (error) {
    throw new ResponseError(500, "Internal Server Error");
  }
};

export default { createTweet, getAllTweets, getTweetByID, updateTweet, deleteTweet };
