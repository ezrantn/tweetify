import express from "express";
import AuthController from "../controller/auth-controller";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../../api-spec.json";

class PublicAPI {
  private authController: AuthController;
  public publicRouter: express.Router;

  constructor() {
    this.authController = new AuthController();
    this.publicRouter = express.Router();

    this.setupRoutes();
  }

  private setupRoutes() {
    this.publicRouter.post(
      "/api/v1/login",
      this.authController.login.bind(this.authController),
    );
    this.publicRouter.post(
      "/api/v1/auth",
      this.authController.authenticate.bind(this.authController),
    );
    this.publicRouter.use(
      "/api/v1/docs",
      swaggerUI.serve,
      swaggerUI.setup(swaggerDocument),
    );
  }
}

export default new PublicAPI().publicRouter;
