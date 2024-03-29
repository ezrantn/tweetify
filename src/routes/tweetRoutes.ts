import { Router, Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

type AuthRequest = Request & { user?: User };

// Create Tweet
router.post("/", async (req: AuthRequest, res: Response) => {
  const { content, image } = req.body;
  const user = req.user;

  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: "User not authenticated" });
  }

  if (!content) {
    return res
      .status(422)
      .json({ status: false, message: "Content cannot be empty" });
  }

  try {
    const result = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: user.id,
      },
    });
    res.status(201).json({
      status: true,
      message: "Tweet created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating tweet:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

// Get All Tweets
router.get("/", async (req, res) => {
  try {
    const allTweets = await prisma.tweet.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    if (allTweets.length === 0) {
      return res
        .status(204)
        .json({ status: false, message: "No tweets found" });
    }

    res.status(200).json({
      status: true,
      message: "Tweets listed successfully",
      data: allTweets,
    });
  } catch (error) {
    console.error("Error while fetching tweets:", error);
    res.status(500).json({
      status: false,
      message:
        "An error occurred while fetching tweets. Please try again later.",
    });
  }
});

// Get Tweet by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || parseInt(id) <= 0) {
    return res.status(400).json({ status: false, message: "Invalid tweet ID" });
  }
  try {
    const result = await prisma.tweet.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });
    if (!result) {
      return res
        .status(204)
        .json({ status: false, message: "Tweet not found" });
    }
    res.status(200).json({
      status: true,
      message: "Tweet by id found successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error while fetching tweet:", error);
    res.status(500).json({
      status: false,
      message:
        "An error occurred while fetching the tweet. Please try again later.",
    });
  }
});

// Update Tweet
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content, image, userId } = req.body;

  if (!id || parseInt(id) <= 0) {
    return res.status(400).json({ status: false, message: "Invalid tweet ID" });
  }

  if (!content) {
    return res
      .status(422)
      .json({ status: false, message: "Content cannot be empty" });
  }

  try {
    const result = await prisma.tweet.update({
      where: { id: Number(id) },
      data: {
        content,
        image,
        userId,
      },
    });
    res.status(200).json({
      status: true,
      message: "Tweet updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error while updating the user:", error);
    res.status(500).json({
      status: false,
      message:
        "An error occurred while updating the tweet. Please try again later.",
    });
  }
});

// Delete Tweet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || parseInt(id) <= 0) {
    return res.status(400).json({ status: false, message: "Invalid tweet ID" });
  }

  try {
    const deletedTweet = await prisma.tweet.delete({
      where: { id: Number(id) },
    });

    if (!deletedTweet) {
      return res
        .status(204)
        .json({ status: false, message: "Tweet not found" });
    }

    res.status(200).json({
      status: true,
      message: "Tweet deleted successfully",
      data: deletedTweet,
    });
  } catch (error) {
    console.error("Error while deleting tweet:", error);
    res
      .status(500)
      .json({
        status: false,
        message:
          "An error occurred while deleting the tweet. Please try again later.",
      });
  }
});

export default router;
