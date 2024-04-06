import express from "express";
import { authMiddleware } from "./middleware/auth-middleware";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../api-spec.json";
import UserController  from "./controller/user-controller";
import TweetController from "./controller/tweet-controller";
import { AuthController } from "./controller/auth-controller";

const app = express();
const apiPrefix = "/api/v1";

app.use(express.json());

// User Routes
app.post(`${apiPrefix}/users`, UserController.createUserController);
app.get(`${apiPrefix}/users/`, authMiddleware, UserController.getAllUsersController);
app.get(`${apiPrefix}/users/:id`, authMiddleware, UserController.getUserByIDController);
app.put(`${apiPrefix}/users/:id`, authMiddleware, UserController.updateUserController);
app.delete(`${apiPrefix}/users/:id`, authMiddleware, UserController.deleteUserController);

// Tweets Routes
app.post(`${apiPrefix}/tweets`, authMiddleware, TweetController.createTweetController);
app.get(`${apiPrefix}/tweets`, authMiddleware, TweetController.getAllTweetsController);
app.get(`${apiPrefix}/tweets/:id`, authMiddleware, TweetController.getTweetByIdController);
app.put(`${apiPrefix}/tweets/:id`, authMiddleware, TweetController.updateTweetController);
app.delete(`${apiPrefix}/tweets/:id`, authMiddleware, TweetController.deleteTweetController);

// Auth Routes
app.post(`${apiPrefix}/login`, AuthController.login);
app.post(`${apiPrefix}/auth`, AuthController.authenticate);

// Swagger Route
app.use(`${apiPrefix}/docs`, swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Hello World. Updated");
});

app.listen(3000, () => {
  console.log("Server Ready at https://localhost:3000");
});
