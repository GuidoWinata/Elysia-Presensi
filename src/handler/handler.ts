import prisma from '../db/client';
import moment from 'moment';
import { siswa, kehadiran, user } from '../db/data';
import { Kehadiran } from '@prisma/client';

export async function masukPresensi(data: Kehadiran) {
  try {
    const now = moment();
    const masuk = moment().set({ hour: 7, minute: 0, second: 0 });
    const formatDate = now.toISOString();
    const formatTime = now.format('HH:mm:ss');

    if (now.isBefore(masuk)) {
      const presensi = await prisma.kehadiran.create({
        data: {
          tanggal: formatDate,
          wktdatang: formatTime,
          siswaId: data.siswaId!,
        },
      });
      return presensi;
    } else {
      console.log('Absensi hanya dapat dilakukan sebelum jam 7 pagi');
      return { message: 'Absensi hanya dapat dilakukan sebelum jam 7 pagi' };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function pulangPresensi(id: number) {
  try {
    const now = moment();
    const pulang = moment().set({ hour: 15, minute: 30, second: 0 });
    const formatTime = now.format('HH:mm:ss');

    if (now.isAfter(pulang)) {
      const idSiswa = await prisma.kehadiran.findFirst({
        where: { siswaId: id },
        orderBy: { tanggal: 'desc' },
      });
      if (idSiswa) {
        const Absensi = await prisma.kehadiran.update({
          where: { id: idSiswa.id },
          data: { wktpulang: formatTime },
        });
        return Absensi;
      } else {
        console.log('Catatan kehadiran tidak ditemukan untuk siswa ini');
        return { message: 'Catatan kehadiran tidak ditemukan untuk siswa ini' };
      }
    } else {
      console.log('Pulang hanya dapat dilakukan setelah jam 15:30');
      return { message: 'Pulang hanya dapat dilakukan setelah jam 15:30' };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findNama(nama: string) {
  try {
    const siswa = await prisma.siswa.findMany({
      where: {
        nama: nama,
      },
    });

    if (!siswa) {
      return { message: 'siswa tidak ditemukan' };
    }
    return siswa;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteKehadiran(id: number) {
  try {
    const hapus = await prisma.kehadiran.delete({
      where: {
        id: id,
      },
    });

    if (!hapus) {
      throw new Error('Data tidak ditemukan');
    } else {
      return { message: 'Berhasil menghapus data' };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createSiswa(options: siswa) {
  try {
    const siswa = await prisma.siswa.create({
      data: options,
    });
    return siswa;
  } catch {
    console.error(Error);
  }
}

export async function updateKehadiran(id: number, options: Kehadiran) {
  try {
    const hadir = await prisma.kehadiran.update({
      where: { id },
      data: options,
    });
    return hadir;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findSiswa(id: number) {
  try {
    const siswa = await prisma.siswa.findUnique({
      where: { id },
      include: {
        kehadiran: true,
      },
    });

    if (!siswa) {
      return { message: 'siswa tidak ditemukan' };
    }
    return siswa;
  } catch {
    console.error(Error);
  }
}

export async function getAllSiswa() {
  try {
    return await prisma.siswa.findMany({
      include: {
        kehadiran: true,
      },
    });
  } catch {
    console.log(Error);
  }
}

export async function getAllKehadiran() {
  try {
    return await prisma.kehadiran.findMany({
      include: {
        siswa: true,
      },
    });
  } catch {
    console.log(Error);
  }
}
