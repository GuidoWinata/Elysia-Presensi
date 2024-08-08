/*
  Warnings:

  - You are about to alter the column `tanggal` on the `kehadiran` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `kehadiran` MODIFY `tanggal` DATETIME(3) NOT NULL,
    MODIFY `wktdatang` VARCHAR(191) NULL,
    MODIFY `wktpulang` VARCHAR(191) NULL;
