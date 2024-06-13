import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

class FileUploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;
  private accessKeyId: string;
  private secretAccessKey: string;

  constructor() {
    this.bucketName = process.env.S3_BUCKET!;
    this.region = process.env.S3_REGION!;
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

    if (!this.accessKeyId || !this.secretAccessKey) {
      throw new Error(
        "AWS credentials are not set in the environment variables",
      );
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  generateFileName(bytes = 32): string {
    return crypto.randomBytes(bytes).toString("hex");
  }

  getS3Client(): S3Client {
    return this.s3Client;
  }

  getBucketName(): string {
    return this.bucketName;
  }
}

export default FileUploadService;
