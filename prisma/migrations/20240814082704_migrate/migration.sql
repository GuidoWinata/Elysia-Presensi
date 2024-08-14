/*
  Warnings:

  - Added the required column `status` to the `Kehadiran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kehadiran` ADD COLUMN `status` ENUM('HADIR', 'SAKIT', 'ALPHA', 'TELAT') NOT NULL;
