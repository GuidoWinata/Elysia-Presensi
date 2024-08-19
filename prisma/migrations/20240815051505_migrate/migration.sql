/*
  Warnings:

  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nisn]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `email`,
    ADD COLUMN `nip` INTEGER NULL,
    ADD COLUMN `nisn` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_nisn_key` ON `User`(`nisn`);

-- CreateIndex
CREATE UNIQUE INDEX `User_nip_key` ON `User`(`nip`);
