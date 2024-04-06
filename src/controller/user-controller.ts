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
    res.json({
      status: true,
      message: "Users retrieved successfully",
      data: allUsers,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
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
  const { id } = req.params;
  try {
    const user = await UserService.getUserByID(id);
    res.json({
      status: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
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
  const { id } = req.params;
  const userData = req.body;
  try {
    const updatedUser = await UserService.updateUser(id, userData);
    res.json({
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
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
  const { id } = req.params;
  try {
    const deletedUser = await UserService.deleteUser(id);
    res.json({
      status: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Failed to delete user",
    });
  }
};

export default {
  createUserController,
  getAllUsersController,
  getUserByIDController,
  updateUserController,
  deleteUserController,
};
