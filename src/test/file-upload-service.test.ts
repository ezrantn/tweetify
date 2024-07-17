import FileUploadService from "../service/file-upload-service";
import { S3Client } from "@aws-sdk/client-s3";
import { test, describe } from "vitest";

test("FileUploadService", () => {
  describe("generateFileName", () => {
    it("should generate a 32-byte hexadecimal string by default", () => {
      const fileUploadService = new FileUploadService();
      const fileName = fileUploadService.generateFileName();

      expect(fileName).toHaveLength(64);
      expect(fileName).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should generate an empty string when bytes is 0", () => {
      const fileUploadService = new FileUploadService();
      const fileName = fileUploadService.generateFileName(0);
      expect(fileName).toBe("");
    });
  });

  describe("getS3Client", () => {
    it("should return an instance of S3Client when called", () => {
      process.env.S3_BUCKET = "test-bucket";
      process.env.S3_REGION = "us-east-1";
      process.env.AWS_ACCESS_KEY_ID = "test-access-key-id";
      process.env.AWS_SECRET_ACCESS_KEY = "test-secret-access-key";

      const fileUploadService = new FileUploadService();
      const s3Client = fileUploadService.getS3Client();

      expect(s3Client).toBeInstanceOf(S3Client);
    });
  });

  describe("getBucketName", () => {
    it("should return the correct bucket name when environment variable is set", () => {
      process.env.S3_BUCKET = "test-bucket";
      const fileUploadService = new FileUploadService();
      expect(fileUploadService.getBucketName()).toBe("test-bucket");
    });
  });
});
