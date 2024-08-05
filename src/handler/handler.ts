import prisma from '../db/client';
import moment from 'moment';
import { siswa, kehadiran, user } from '../db/data';
import { Kehadiran } from '@prisma/client';

export async function createPresensi(data: Partial<kehadiran>) {
  try {
    const now = new Date();
    const formatDate = moment(now).format('DD-MM-YYYY');
    const formatTime = moment(now).format('HH:mm:ss');
    const presensi = await prisma.kehadiran.create({
      data: {
        tanggal: formatDate,
        wktdatang: formatTime,
        wktpulang: formatTime,
        siswaId: data.siswaId!,
      },
    });
    return presensi;
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
