import jwt from "jsonwebtoken";
import { Router } from "express";

const router = Router();
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";

function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function generateAuthToken(tokenId: number): string {
  const jwtPayload = { tokenId };
  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: "HS256",
    noTimestamp: true,
  });
}

export {
  router,
  EMAIL_TOKEN_EXPIRATION_MINUTES,
  AUTHENTICATION_EXPIRATION_HOURS,
  JWT_SECRET,
  generateAuthToken,
  generateEmailToken,
};
