import { app } from "../src";
import { prismaClient } from "../src/prisma-client";
import request from "supertest";

beforeEach(async () => {
  await prismaClient.user.deleteMany();
});

afterAll(async () => {
  await prismaClient.$disconnect;
});

describe("Create User", () => {
  it("should create a new user successfully", async () => {
    const response = await request(app).post("/api/v1/users/").send({
      email: "test@example.com",
      name: "Test User",
      username: "testuser",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("status", true),
      expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id");
  });
});
