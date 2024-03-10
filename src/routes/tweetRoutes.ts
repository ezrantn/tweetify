import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();


// Create Tweet
router.post("/", async (req, res) => {
  const { content, image } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.sendStatus(404).json({ status: false, message: "Unauthorized"})
  }
  console.log(token);

  res.sendStatus(200);

  // try {
  //   const result = await prisma.tweet.create({
  //     data: {
  //       content,
  //       image,
  //       userId, // TODO manage based on the auth user
  //     },
  //   });
  //   res.json({
  //     status: true,
  //     message: "Tweet created successfully",
  //     data: result,
  //   });
  // } catch (error) {
  //   res.status(400).json({ status: false, message: "Failed to create tweet" });
  // }
});

// Get All Tweets
router.get("/", async (req, res) => {
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
    res.status(404).json({ status: false, message: "No tweets found" });
  }

  try {
    res.json({
      status: true,
      message: "Tweets listed successfully",
      data: allTweets,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message:
        "An error occurred while fetching users. Please try again later.",
    });
  }
});

// Get Tweet by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
  if (!result) {
    return res.status(404).json({ status: false, message: "Tweet Not Found" });
  }
  res.json({
    status: true,
    message: "Tweet by id found successfully",
    data: result,
  });
});

// Update Tweet
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content, image, userId } = req.body;
  try {
    const result = await prisma.tweet.update({
      where: { id: Number(id) },
      data: {
        content,
        image,
        userId,
      },
    });
    res.json({
      status: true,
      message: "Tweet updated successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Failed to update the tweet" });
  }
});

// Delete Tweet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTweet = await prisma.tweet.delete({
      where: { id: Number(id) },
    });
    res.json({
      status: true,
      message: "Tweet deleted successfully",
      data: deletedTweet,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Failed to delete the tweet" });
  }
});

export default router;