import { Prisma } from "@prisma/client";
import { prismaClient } from "../prisma-client";
import { z } from "zod";
import { router } from "../utils";

// Create User
router.post("/", async (req, res) => {
  const userSchema = z.object({
    email: z.string().email().max(100).min(3),
    name: z.string().min(1).trim(),
    username: z.string().min(3).trim(),
  });

  try {
    const { email, name, username } = userSchema.parse(req.body);

    if (!email || !name || !username) {
      return res
        .status(422)
        .json({ status: false, message: "Body cannot be empty" });
    }

    const result = await prismaClient.user.create({
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
    if (error.message === "zod-validation-error") {
      return res.status(422).json({
        status: false,
        message: "Validation error: " + error.issues[0].message,
      });
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ status: false, message: "Username or email already exists" });
    }

    console.error("Error creating user:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while creating the user",
    });
  }
});

// Get All Users
router.get("/", async (req, res) => {
  try {
    const allUser = await prismaClient.user.findMany();

    if (allUser.length === 0) {
      res.status(404).json({ status: false, message: "No users found" });
    }

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

  try {
    const user = await prismaClient.user.findUnique({
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
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      status: false,
      message:
        "An error occurred while fetching the user. Please try again later.",
    });
  }
});

// Update User
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const updateUserSchema = z.object({
    bio: z.string().optional(),
    name: z.string().min(1).trim(),
    image: z.string().optional(),
    username: z.string().min(3).trim(),
    email: z.string().email().max(100).min(3),
  });

  try {
    const { bio, name, image, username, email } = updateUserSchema.parse(
      req.body
    );
    const result = await prismaClient.user.update({
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
    if (error.code === "zod-validation-error") {
      return res.status(422).json({
        status: false,
        message: "Validation error: " + error.issues[0].message,
      });
    } else {
      console.error("Error updating user:", error);
      res.status(500).json({
        status: false,
        message: "Failed to update the user",
      });
    }
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await prismaClient.user.delete({
      where: { id: Number(id) },
    });
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
