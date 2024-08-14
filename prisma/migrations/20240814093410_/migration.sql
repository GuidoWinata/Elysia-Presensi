-- AlterTable
ALTER TABLE `kehadiran` MODIFY `status` ENUM('HADIR', 'IZIN', 'ALPHA', 'TELAT', 'PULANG') NOT NULL;
