/*
  Warnings:

  - The values [SAKIT] on the enum `Kehadiran_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `kehadiran` MODIFY `status` ENUM('HADIR', 'IZIN', 'ALPHA', 'TELAT') NOT NULL;
