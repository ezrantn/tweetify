import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import sharp from "sharp";
import crypto from "crypto";
import {prismaClient} from "../application/database";

dotenv.config();

export const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const bucketName = process.env.S3_BUCKET;
const region = process.env.S3_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

/* S3 CLIENT COMPLAINING COMPILER ERROR */
export const s3Client = new S3Client({
  // region: region,
  // credentials: {
  //   accessKeyId: accessKeyId,
  //   secretAccessKey: secretAccessKey,
  // },
});

export interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
}

export async function uploadFileToS3(file: UploadedFile, fileName: string): Promise<void> {
  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer();

  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: file.mimetype,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
}

async function saveImageToDatabase(imageName: string, email: string) {
  return prismaClient.user.create({
    data: {
      image: imageName,
      email: email
    },
  });
}
