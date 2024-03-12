import { Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Create User 
//! ERROR Unauthorized (Probably in the middleware) "I'll check that later"
router.post("/", async (req, res) => {
  const { email, name, username } = req.body;

  if (!email || !name || !username) {
    return res
      .status(422)
      .json({ status: false, message: "Body cannot be empty" });
  }

  try {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        username,
        bio: "Hello, I'm new on Twitter",
      },
    });
    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ status: false, message: "Username or email already exists" });
    }

    console.error("Error creating user:", error);
    res
      .status(500)
      .json({
        status: false,
        message: "An error occurred while creating the user",
      });
  }
});

// Get All Users
router.get("/", async (req, res) => {
  const allUser = await prisma.user.findMany();

  if (allUser.length === 0) {
    res.status(404).json({ status: false, message: "No users found" });
  }

  try {
    res.json({
      status: true,
      message: "Users listed successfully",
      data: allUser,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message:
        "An error occurred while fetching users. Please try again later.",
    });
  }
});

// Get User by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { tweets: true },
  });
  if (!user) {
    res.status(404).json({ status: false, message: "User not found" });
  }
  res.json({
    status: true,
    message: "User get by id found successfully",
    data: user,
  });
});

// Update User
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, name, image, username, email } = req.body;
  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        bio,
        name,
        image,
        username,
        email,
      },
    });
    res.json({
      status: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Failed to update the user" });
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.user.delete({ where: { id: Number(id) } });
    res.json({
      status: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Failed to delete the user" });
  }
});

export default router;
