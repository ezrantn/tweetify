import { Request, Response } from "express";
import { logger } from "../application/logger";
import AuthenticationService from "../service/auth-service";

class AuthController {
  private authService: AuthenticationService;

  constructor() {
    this.authService = new AuthenticationService();
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.authService.login(email);
      res.sendStatus(200);
    } catch (error) {
      logger.error("Error creating token:", error);
      res.status(400).json({ error: "Failed to create token" });
    }
  }

  async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const { email, emailToken } = req.body;
      const authToken = await this.authService.authenticate(email, emailToken);
      res.json({ authToken });
    } catch (error) {
      logger.error("Error authenticating:", error);
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to authenticate" });
      }
    }
  }
}

export default AuthController;
