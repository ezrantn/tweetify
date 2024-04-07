import express from "express";
import authController from "../controller/auth-controller";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../../api-spec.json";

export const publicRouter = express.Router();
publicRouter.post("/api/users/login", authController.login);
publicRouter.post("/api/users/auth", authController.authenticate)
publicRouter.post("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
