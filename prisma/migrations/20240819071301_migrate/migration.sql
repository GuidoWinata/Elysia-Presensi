/*
  Warnings:

  - A unique constraint covering the columns `[nisn]` on the table `Siswa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Siswa_nisn_key` ON `Siswa`(`nisn`);
