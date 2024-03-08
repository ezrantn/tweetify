import express from "express";
import userRoutes from "./routes/userRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import authRoutes from "./routes/authRoutes";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
const swaggerSpec = YAML.load('api-spec.yaml');

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(express.json());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.send("Hello World. Updated");
});

app.listen(3000, () => {
    console.log("Server Ready at https://localhost:3000");
});