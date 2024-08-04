/*
  Warnings:

  - Added the required column `siswaId` to the `Kehadiran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `Siswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kehadiran` ADD COLUMN `siswaId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `siswa` ADD COLUMN `nama` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Kehadiran` ADD CONSTRAINT `Kehadiran_siswaId_fkey` FOREIGN KEY (`siswaId`) REFERENCES `Siswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
