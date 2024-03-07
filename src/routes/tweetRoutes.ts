import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Tweet CRUD

// Create Tweet
router.post("/", async (req, res) => {
  const { content, image, userId } = req.body;
  try {
    const result = await prisma.tweet.create({
      data: {
        content,
        image,
        userId, // TODO manage based on the auth user
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to create tweet" });
  }
});

// List Tweet
router.get("/", async (req, res) => {
  const allTweet = await prisma.tweet.findMany({
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
  res.json(allTweet);
});

// Get One Tweet
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
  if (!result) {
    return res.status(404).json({ error: "Tweet Not Found" });
  }
  res.json(result);
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
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to update the tweet" });
  }
});

// Delete Tweet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.tweet.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;
