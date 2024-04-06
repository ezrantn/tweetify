import { Request, Response } from "express";
import { AuthenticationService } from "../service/auth-service";
import { logger } from "../application/logger";

export const AuthController = {
    login: async (req: Request, res: Response): Promise<void> => {
      try {
        const { email } = req.body;
        await AuthenticationService.login(email);
        res.sendStatus(200);
      } catch (error) {
        logger.error("Error creating token:", error);
        res.status(400).json({ error: "Failed to create token" });
      }
    },
  
    authenticate: async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, emailToken } = req.body;
        const authToken = await AuthenticationService.authenticate(email, emailToken);
        res.json({ authToken });
      } catch (error) {
        logger.error("Error authenticating:", error);
        if (error instanceof Error) {
          res.status(401).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Failed to authenticate" });
        }
      }
    },
  };