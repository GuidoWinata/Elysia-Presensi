/*
  Warnings:

  - You are about to drop the column `kelas` on the `siswa` table. All the data in the column will be lost.
  - Added the required column `kelasId` to the `Siswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `siswa` DROP COLUMN `kelas`,
    ADD COLUMN `kelasId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Siswa` ADD CONSTRAINT `Siswa_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `Kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
