import {S3Client} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");

export const bucketName = process.env.S3_BUCKET;
export const region = process.env.S3_REGION;
export const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
export const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS credentials are not set in the environment variables");
}

export const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});