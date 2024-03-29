import express from "express";
import userRoutes from "./routes/userRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import authRoutes from "./routes/authRoutes";
import { authMiddleware } from "./middleware/authMiddleware";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../api-spec.json";

export const app = express();

app.use(express.json());
app.use("/api/v1/users", authMiddleware, userRoutes);
app.use("/api/v1/tweets", authMiddleware, tweetRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Hello World. Updated");
});

app.listen(3000, () => {
  console.log("Server Ready at https://localhost:3000");
});
