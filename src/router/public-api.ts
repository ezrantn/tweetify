import express from "express";
import authController from "../controller/auth-controller";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../../api-spec.json";

export const publicRouter = express.Router();
publicRouter.post("/api/v1/login", authController.login);
publicRouter.post("/api/v1/auth", authController.authenticate)
publicRouter.post("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
