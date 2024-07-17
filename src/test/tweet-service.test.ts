import TweetService from "../service/tweet-service";
import prisma from "../libs/__mocks__/prisma";
import { expect, test, vi, describe } from "vitest";
import { ResponseError } from "../error/error";
import { Tweet } from "../types/tweet-types";

vi.mock("../application/database.ts");

describe("Tweet Service", () => {
  test("createTweet", () => {
    it("should create a tweet successfully when valid content and userId are provided", async () => {
      const tweetService = new TweetService();
      const newTweetData = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        content: "Exciting news!",
        image: null,
        impression: 0,
        userId: 100,
      };

      prisma.tweet.create.mockResolvedValue(newTweetData);

      const result = await tweetService.createTweet(
        newTweetData,
        newTweetData.userId.toString(),
      );

      expect(result).toEqual(newTweetData);
    });

    it("should handle invalid userId gracefully", async () => {
      const tweetService = new TweetService();
      const newTweetData = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        content: "Exciting news!",
        image: null,
        impression: 0,
        userId: 100,
      };

      const result = await tweetService.createTweet(
        newTweetData,
        newTweetData.userId.toString(),
      );

      expect(result).rejects.toThrow(new ResponseError(404, "Not Found"));
    });

    it("should throw a ResponseError with status 500 on unexpected errors", async () => {
      const tweetService = new TweetService();
      const newTweetData = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        content: "Exciting news!",
        image: null,
        impression: 0,
        userId: 100,
      };

      prisma.tweet.create.mockRejectedValue(new Error("Unexpected error"));

      const result = await tweetService.createTweet(
        newTweetData,
        newTweetData.userId.toString(),
      );

      expect(result).rejects.toThrow(
        new ResponseError(500, "Unexpected error"),
      );
    });
  });

  test("getAllTweets", () => {
    it("should retrieve all tweets with associated user details", async () => {
      const tweetService = new TweetService();
      const mockTweets = [
        {
          id: 1,
          content: "Test tweet",
          image: null,
          user: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            image: null,
          },
        },
      ];

      prisma.tweet.findMany.mockResolvedValue(mockTweets);

      const result = await tweetService.getAllTweets();

      expect(result).toEqual(mockTweets);
      expect(prisma.tweet.findMany).toHaveBeenCalledWith({
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
    });

    it("should throw an error when no tweets exist in the database", async () => {
      const tweetService = new TweetService();
      prisma.tweet.findMany.mockResolvedValue([]);

      const result = await tweetService.getAllTweets();

      expect(result).rejects.toThrow(ResponseError);
      expect(result).rejects.toThrow("Tweets not found");
      expect(prisma.tweet.findMany).toHaveBeenCalledWith({
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
    });

    it("should throw an error when database connection issues occur during retrieval", async () => {
      const tweetService = new TweetService();
      prisma.tweet.findMany.mockRejectedValue(
        new Error("Database connection error"),
      );

      const result = await tweetService.getAllTweets();

      expect(tweetService.getAllTweets()).rejects.toThrow(ResponseError);
      expect(tweetService.getAllTweets()).rejects.toThrow(
        "Internal Server Error",
      );
      expect(prisma.tweet.findMany).toHaveBeenCalledWith({
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
    });
  });

  test("getTweetById", () => {
    it("should return when give a valid ID", async () => {
      const tweetService = new TweetService();
      const mockTweet = {
        id: 1,
        content: "Test tweet",
        user: {
          id: 1,
          name: "Test User",
        },
      };

      prisma.tweet.findUnique.mockResolvedValue(mockTweet);

      const result = await tweetService.getTweetByID("1");

      expect(result).toEqual(mockTweet);
      expect(prisma.tweet.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        include: {
          user: true,
        },
      });
    });

    it("should throw 404 error when tweet ID does not exist", async () => {
      const tweetService = new TweetService();

      prisma.tweet.findUnique.mockResolvedValue(null);

      const result = await tweetService.getTweetByID("999");

      expect(result).rejects.toThrow("Not Found");
      expect(prisma.tweet.findUnique).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
        include: {
          user: true,
        },
      });
    });

    it("should throw 500 error when given an invalid ID format", async () => {
      const tweetService = new TweetService();

      prisma.tweet.findUnique.mockImplementation(() => {
        throw new Error("Invalid ID format");
      });

      const result = await tweetService.getTweetByID("invalid");

      expect(result).rejects.toThrow("Internal Server Error");
      expect(prisma.tweet.findUnique).toHaveBeenCalledWith({
        where: {
          id: NaN,
        },
        include: {
          user: true,
        },
      });
    });
  });

  test("updateTweet", () => {
    it("should update the tweet successfully when valid ID and data are provided", async () => {
      const tweetService = new TweetService();
      const tweetId = "123";
      const updatedTweetData = new Tweet(
        123,
        new Date(),
        new Date(),
        "Updated content",
        "new-image.jpg",
        10,
      );

      prisma.tweet.update.mockResolvedValue(updatedTweetData);

      const result = await tweetService.updateTweet(tweetId, updatedTweetData);

      expect(result).toEqual(updatedTweetData);
      expect(prisma.tweet.update).toHaveBeenCalledWith({
        where: {
          id: Number(tweetId),
        },
        data: {
          content: updatedTweetData.content,
          image: updatedTweetData.image,
          userId: updatedTweetData.id,
        },
      });
    });

    it("should return the updated tweet object when update is successful", async () => {
      const tweetService = new TweetService();
      const id = "1";
      const newData = {
        content: "Updated content",
        image: "new-image.jpg",
        userId: 100,
      };
      const updatedTweet = {
        id: 1,
        content: "Updated content",
        image: "new-image.jpg",
        userId: 100,
      };

      prisma.tweet.update.mockResolvedValue(updatedTweet);

      const result = await tweetService.updateTweet(id, newData);

      expect(result).toEqual(updatedTweet);
    });

    it("should throw ResponseError with status 404 when tweet ID does not exist", async () => {
      const tweetService = new TweetService();
      const tweetId = "123";
      const newData = {
        content: "Updated content",
        image: "new-image.jpg",
        userId: 100,
      };

      prisma.tweet.update.mockResolvedValue(null);

      const result = await tweetService.updateTweet(tweetId, newData);

      expect(result).rejects.toThrow(new ResponseError(404, "Tweet Not Found"));
    });

    it("should throw ResponseError with status 500 for unexpected errors during update", async () => {
      const tweetService = new TweetService();
      const id = "1";
      const newData = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: "Updated content",
        image: null,
        impression: 0,
        userId: 100,
      };

      prisma.tweet.update.mockRejectedValue(new Error("Unexpected error"));

      const result = tweetService.updateTweet(id, newData);

      await expect(result).rejects.toThrow(
        new ResponseError(500, "Internal Server Error"),
      );
    });

    it("should handle PrismaClientKnownRequestError with code P2025 gracefully", async () => {
      const tweetService = new TweetService();
      const id = "1";
      const newData = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: "Updated content",
        image: "new-image.jpg",
        userId: 100,
      };

      prisma.tweet.update.mockRejectedValue({
        code: "P2025",
      });

      await expect(tweetService.updateTweet(id, newData)).rejects.toThrow(
        new ResponseError(400, "Invalid data provided for update"),
      );
    });
  });

  test("deleteTweet", () => {
    it("should set deletedAt field when tweet is successfully deleted", async () => {
      const tweetService = new TweetService();
      const mockUpdate = vi
        .spyOn(prisma.tweet, "update")
        .mockResolvedValue({ id: 1, deletedAt: new Date() });

      await tweetService.deleteTweet("1");

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });

      mockUpdate.mockRestore();
    });

    it("should throw an error when tweet ID is non-numeric", async () => {
      const tweetService = new TweetService();

      await expect(tweetService.deleteTweet("abc")).rejects.toThrow(
        ResponseError,
      );
    });

    it("should throw a 404 error when tweet ID does not exist", async () => {
      const tweetService = new TweetService();
      const mockUpdate = vi
        .spyOn(prisma.tweet, "update")
        .mockResolvedValue(null);

      await expect(tweetService.deleteTweet("999")).rejects.toThrow(
        new ResponseError(404, "Tweet Not Found"),
      );

      mockUpdate.mockRestore();
    });
  });
});
