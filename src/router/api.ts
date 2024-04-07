import express from "express";
import userController from "../controller/user-controller";
import authMiddleware from "../middleware/auth-middleware";
import tweetController from "../controller/tweet-controller";

export const privateApi =  express.Router();
privateApi.use(authMiddleware);

// User Routes
privateApi.post("/api/v1/users", userController.createUserController);
privateApi.get("/api/v1/users", userController.getAllUsersController);
privateApi.get("/api/v1/users/:id", userController.getUserByIDController);
privateApi.put("/api/v1/users/:id", userController.updateUserController);
privateApi.delete("/api/v1/users/:id", userController.deleteUserController);

// Tweet Routes
privateApi.post("/api/v1/tweets", tweetController.createTweetController);
privateApi.get("/api/v1/tweets", tweetController.getAllTweetsController);
privateApi.get("/api/v1/tweets/:id", tweetController.getTweetByIdController);
privateApi.put("/api/v1/tweets/:id", tweetController.updateTweetController);
privateApi.delete("/api/v1/tweets:id", tweetController.deleteTweetController);