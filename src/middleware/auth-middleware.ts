import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { JWT_SECRET } from "../application/utils";

type AuthRequest = Request & { user?: User };

export default async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader?.split(" ")[1];

  if (!jwtToken) {
    return res
      .status(401)
      .json({ status: false, message: `Unauthorized: No token provided` });
  }

  try {
    const payload = (await jwt.verify(jwtToken, JWT_SECRET)) as {
      tokenId: number;
    };
    const dbToken = await prismaClient.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      return res.status(401).json({
        status: false,
        message: `Unauthorized: Token is invalid or expired`,
      });
    }

    req.user = dbToken.user;
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(401).json({
      status: false,
      message: `Unauthorized: Error in authentication middleware"`,
    });
  }
  next();
}
