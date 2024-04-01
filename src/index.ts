import express from "express";
import userRoutes from "./routes/user-routes";
import tweetRoutes from "./routes/tweet-routes";
import authRoutes from "./routes/auth-routes";
import { authMiddleware } from "./middleware/auth-middleware";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../api-spec.json";

const app = express();
const apiPrefix = "/api/v1";

app.use(express.json());

app.use(`${apiPrefix}/users`, authMiddleware, userRoutes);
app.use(`${apiPrefix}/tweets`, authMiddleware, tweetRoutes);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(
  `${apiPrefix}/docs`,
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);

app.get("/", (req, res) => {
  res.send("Hello World. Updated");
});

app.listen(3000, () => {
  console.log("Server Ready at https://localhost:3000");
});
