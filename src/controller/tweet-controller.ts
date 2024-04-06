import { Request, Response } from "express";
import { User } from "../types/user-types";
import { Tweet } from "../types/tweet-types";
import TweetService from "../service/tweet-service";
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
      logger.error("User is not authenticated");
      throw new ResponseError(400, "Bad Request");
    }

    const createdTweet = await TweetService.createTweet(
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

const getAllTweetsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allTweets = await TweetService.getAllTweets();

    if (!allTweets) {
      logger.error("No tweets found!");
      throw new ResponseError(404, "Tweets not found")
    }
    
    res.status(200).json({
      status: true,
      message: "Success Get All Tweets",
      data: allTweets,
    });
  } catch (error) {
    logger.error("Error getting all tweets:", error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Failed to retrieve tweets",
    });
  }
};

const getTweetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tweetId = await TweetService.getTweetByID(id);
    res.status(200).json({
      status: true,
      message: "Success get tweet by ID",
      data: tweetId,
    });
  } catch (error) {
    logger.error("Error getting tweet by ID:", error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Failed to retrieve tweets by ID",
    });
  }
};

const updateTweetController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tweetData = req.body;
    const updatedTweet = await TweetService.updateTweet(id, tweetData);
    res.status(200).json({
      status: true,
      message: "Success Update Tweet",
      data: updatedTweet
    })
  } catch (error) {
    logger.error("Error updating tweet:", error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Failed to update tweet",
    });
  }
} 

const deleteTweetController = async (req: Request, res: Response): Promise<void> => {
  try {
    const  { id } = req.params;
    await  TweetService.deleteTweet(id);
    res.sendStatus(204);
  } catch (error) {
    logger.error("Error deleting tweet:", error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Failed to delete tweet",
    });
  }
}

export default { createTweetController, getAllTweetsController, getTweetByIdController, updateTweetController, deleteTweetController };
