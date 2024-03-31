import jwt from "jsonwebtoken";
import { Router } from "express";

export const router = Router();
export const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
export const AUTHENTICATION_EXPIRATION_HOURS = 12;
export const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";

export function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export function generateAuthToken(tokenId: number): string {
  const jwtPayload = { tokenId };
  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: "HS256",
    noTimestamp: true,
  });
}
