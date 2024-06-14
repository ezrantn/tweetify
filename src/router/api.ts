import express from "express";
import UserController from "../controller/user-controller";
import AuthMiddleware from "../middleware/auth-middleware";
import TweetController from "../controller/tweet-controller";
import multer from "multer";

class PrivateAPI {
  public privateRouter: express.Router;
  private authMiddleware: AuthMiddleware;
  private userController: UserController;
  private tweetController: TweetController;

  private upload: multer.Multer;

  constructor() {
    this.privateRouter = express.Router();
    this.upload = multer({ storage: multer.memoryStorage() });
    this.authMiddleware = new AuthMiddleware();
    this.userController = new UserController();
    this.tweetController = new TweetController();

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.privateRouter.use(
      this.authMiddleware.authMiddleware.bind(this.authMiddleware),
    );
  }

  private setupRoutes() {
    this.privateRouter.post(
      "/api/v1/users",
      this.userController.createNewUser.bind(this.userController),
    );
    this.privateRouter.get(
      "/api/v1/users",
      this.userController.getAllUsersController.bind(this.userController),
    );
    this.privateRouter.get(
      "/api/v1/users/result",
      this.userController.getUserBasedOnUsername.bind(this.userController),
    );
    this.privateRouter.get(
      "/api/v1/users/:id",
      this.userController.getUserByIDController.bind(this.userController),
    );
    this.privateRouter.put(
      "/api/v1/users/:id",
      this.userController.updateUserController.bind(this.userController),
    );
    this.privateRouter.delete(
      "/api/v1/users/:id",
      this.userController.deleteUserController.bind(this.userController),
    );
    this.privateRouter.post(
      "/api/v1/users/upload/:id",
      this.upload.single("avatar"),
      this.userController.uploadAvatarController.bind(this.userController),
    );
    this.privateRouter.delete(
      "/api/v1/users/delete-avatar/:id",
      this.userController.deleteAvatarController.bind(this.userController),
    );

    // Tweet Routes
    this.privateRouter.post(
      "/api/v1/tweets",
      this.tweetController.createTweetController.bind(this.tweetController),
    );
    this.privateRouter.get(
      "/api/v1/tweets",
      this.tweetController.getAllTweetsController.bind(this.tweetController),
    );
    this.privateRouter.get(
      "/api/v1/tweets/:id",
      this.tweetController.getTweetByIdController.bind(this.tweetController),
    );
    this.privateRouter.put(
      "/api/v1/tweets/:id",
      this.tweetController.updateTweetController.bind(this.tweetController),
    );
    this.privateRouter.delete(
      "/api/v1/tweets/:id",
      this.tweetController.deleteTweetController.bind(this.tweetController),
    );
  }
}

export default new PrivateAPI().privateRouter;
