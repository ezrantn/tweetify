/*
  Warnings:

  - You are about to alter the column `type` on the `token` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `emailToken` on the `token` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `content` on the `tweets` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `image` on the `tweets` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `image` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `bio` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "token" ALTER COLUMN "type" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "emailToken" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "tweets" ALTER COLUMN "content" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "bio" SET DATA TYPE VARCHAR(100);
