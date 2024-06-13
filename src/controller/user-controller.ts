import { logger } from "../application/logger";
import { Request, Response } from "express";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ResponseError } from "../error/error";
import UserService from "../service/user-service";
import FileUploadService from "../service/file-upload-service";

class UserController {
  private userService: UserService;
  private s3Client: S3Client;
  private fileUploadService: FileUploadService;

  constructor() {
    this.userService = new UserService();
    this.s3Client = new S3Client();
    this.fileUploadService = new FileUploadService();
  }

  async createNewUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const newUser = await this.userService.createUser(userData);
      res.status(201).json({
        status: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      logger.error("Error creating user:", error);
      res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Failed to create user",
      });
    }
  }

  async getAllUsersController(req: Request, res: Response): Promise<void> {
    try {
      const allUsers = await this.userService.getAllUsers();
      res.status(200).json({
        status: true,
        message: "Users retrieved successfully",
        data: allUsers,
      });
    } catch (error) {
      logger.error("Error retrieving users:", error);
      res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Failed to retrieve users",
      });
    }
  }

  async getUserByIDController(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserByID(id);
      res.status(200).json({
        status: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      logger.error("Error retrieving user:", error);
      res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Failed to retrieve user",
      });
    }
  }

  async updateUserController(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await this.userService.updateUser(id, userData);
      res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      logger.error("Error updating user:", error);
      res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Failed to update user",
      });
    }
  }

  async deleteUserController(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      res.sendStatus(204);
    } catch (error) {
      logger.error("Error deleting user:", error);
      res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Failed to delete user",
      });
    }
  }

  async getUserBasedOnUsername(req: Request, res: Response): Promise<void> {
    try {
      const username = req.query.username;

      if (typeof username !== "string" || !username) {
        res.status(400).json({
          status: false,
          message: "Bad request",
        });
        return;
      }

      const user = await this.userService.searchUserBasedOnUsername(username);

      res.status(200).json({
        status: true,
        message: "User found",
        data: user,
      });
    } catch (error) {
      logger.error("Error getting the username:", error);
      res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "bad request",
      });
    }
  }

  async uploadAvatarController(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const image = req.file;

      if (!image) {
        throw new ResponseError(404, "No image uploaded!");
      }

      const fileName = this.fileUploadService.generateFileName();
      const uploadParams = {
        Bucket: this.fileUploadService.getBucketName(),
        Body: image.buffer,
        Key: fileName,
        ContentType: image.mimetype,
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));

      const signedUrl = await getSignedUrl(
        this.s3Client,
        new GetObjectCommand({
          Bucket: this.fileUploadService.getBucketName(),
          Key: fileName,
        }),
        { expiresIn: 60 },
      );

      await this.userService.uploadAvatar(id, signedUrl);

      res.status(201).json({
        status: true,
        message: "Avatar uploaded successfully",
        data: signedUrl,
      });
    } catch (error) {
      logger.error("Error upload avatar user:", error);
      res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Failed to upload avatar user",
      });
    }
  }

  async deleteAvatarController(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await this.userService.deleteAvatar(id);
      res.sendStatus(204);
    } catch (error) {
      logger.error("Error deleting avatar:", error);
      res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Failed to delete the avatar",
      });
    }
  }
}

export default UserController;
