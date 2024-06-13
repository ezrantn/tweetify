import jwt from "jsonwebtoken";
import { Router } from "express";

class Helper {
  private router = Router();
  private EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
  private AUTHENTICATION_EXPIRATION_HOURS = 12;
  private JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";

  getRouter(): Router {
    return this.router;
  }

  getEmailTokenExpirationMinutes(): number {
    return this.EMAIL_TOKEN_EXPIRATION_MINUTES;
  }

  getAuthenticationExpirationHours(): number {
    return this.AUTHENTICATION_EXPIRATION_HOURS;
  }

  getJWTSecret(): string {
    return this.JWT_SECRET;
  }

  generateEmailToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  generateAuthToken(tokenId: number): string {
    const jwtPayload = { tokenId };
    return jwt.sign(jwtPayload, this.JWT_SECRET, {
      algorithm: "HS256",
      noTimestamp: true,
    });
  }
}

export default Helper;
