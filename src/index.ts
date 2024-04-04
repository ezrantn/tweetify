import express from "express";
import tweetRoutes from "./route/tweet-routes";
import authRoutes from "./route/auth-routes";
import { authMiddleware } from "./middleware/auth-middleware";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../api-spec.json";
import UserController  from "./controller/user-controller";

const app = express();
const apiPrefix = "/api/v1";

app.use(express.json());

// User Routes
app.post(`${apiPrefix}/users`, UserController.createUserController);
app.get(
  `${apiPrefix}/users/`,
  authMiddleware,
  UserController.getAllUsersController
);
app.get(
  `${apiPrefix}/users/:id`,
  authMiddleware,
  UserController.getUserByIDController
);
app.put(
  `${apiPrefix}/users/:id`,
  authMiddleware,
  UserController.updateUserController
);
app.delete(
  `${apiPrefix}/users/:id`,
  authMiddleware,
  UserController.deleteUserController
);

app.use(`${apiPrefix}/tweets`, authMiddleware, tweetRoutes);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/docs`, swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Hello World. Updated");
});

app.listen(3000, () => {
  console.log("Server Ready at https://localhost:3000");
});
