import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";
console.log("JWT secret: ", JWT_SECRET);
const prisma = new PrismaClient();
type AuthRequest = Request & { user?: User };

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader?.split(" ")[1];

  if (!jwtToken) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }

  // decode the jwt token
  try {
    const payload = (await jwt.verify(jwtToken, JWT_SECRET)) as {
      tokenId: number;
    };
    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    req.user = dbToken.user;
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
  next();
}
