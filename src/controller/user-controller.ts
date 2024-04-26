import { logger } from "../application/logger";
import UserService from "../service/user-service";
import { Request, Response } from "express";

const createUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData = req.body;
    const newUser = await UserService.createUser(userData);
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
};

const getAllUsersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allUsers = await UserService.getAllUsers();
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
};

const getUserByIDController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserByID(id);
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
};

const updateUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const updatedUser = await UserService.updateUser(id, userData);
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
};

const deleteUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);
    res.sendStatus(204);
  } catch (error) {
    logger.error("Error deleting user:", error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Failed to delete user",
    });
  }
};

const uploadAvatarController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { file } = req.body;
    const uploadedFile = file as Express.Multer.File

    const uploadedImageUrl = await UserService.uploadAvatar(id, uploadedFile);

    res.status(200).json({
      status: true,
      message: "Avatar uploaded successfully",
      image_url: uploadedImageUrl
    });
  } catch (error) {
    logger.error("Error upload avatar user:", error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Failed to upload avatar user",
    });
  }
};

export default {
  createUserController,
  getAllUsersController,
  getUserByIDController,
  updateUserController,
  deleteUserController,
  uploadAvatarController,
};
