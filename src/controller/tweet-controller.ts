import { Request, Response } from "express";
import { User } from "../types/user-types";
import { Tweet } from "../types/tweet-types";
import tweetService from "../service/tweet-service";
import { ResponseError } from "../error/error";
import { logger } from "../application/logger";

type AuthRequest = Request & { user?: User };

const createTweetController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tweetData: Tweet = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new ResponseError(400, "Bad Request");
    }

    const createdTweet = await tweetService.createTweet(
      tweetData,
      userId.toString()
    );

    res.status(201).json({
      status: true,
      message: "Tweet created successfully!",
      data: createdTweet,
    });
  } catch (error) {
    logger.error("Error creating tweet:", error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Failed to create tweet",
    });
  }
};

export default { createTweetController }