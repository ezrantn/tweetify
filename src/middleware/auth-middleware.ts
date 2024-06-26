import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import Helper from "../application/utils";

type AuthRequest = Request & { user?: User };

class AuthMiddleware {
  private helper: Helper;
  private prismaClient: PrismaClient;

  constructor() {
    this.helper = new Helper();
    this.prismaClient = new PrismaClient();
  }

  async authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const jwtToken = authHeader?.split(" ")[1];

    if (!jwtToken) {
      return res
        .status(401)
        .json({ status: false, message: `Unauthorized: No token provided` });
    }

    try {
      const payload = (await jwt.verify(
        jwtToken,
        this.helper.getJWTSecret(),
      )) as {
        tokenId: number;
      };
      const dbToken = await this.prismaClient.token.findUnique({
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
      return res.status(401).json({
        status: false,
        message: `Unauthorized: Error in authentication middleware"`,
      });
    }
    next();
  }
}

export default AuthMiddleware;
