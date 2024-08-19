import prisma from '../db/client';
import moment from 'moment';
import bcrypt from 'bcrypt';
import { Kehadiran, Kelas, Siswa, User } from '@prisma/client';

export async function masukPresensi(data: Kehadiran) {
  try {
    const now = moment();
    const masuk = moment().set({ hour: 7, minute: 0, second: 0 });
    const belumPulang = moment().set({ hour: 10, minute: 0, second: 0 });
    const pulang = moment().set({ hour: 15, minute: 30, second: 0 });
    const formatDate = now.toISOString();
    const formatTime = now.format('HH:mm:ss');

    if (!data.siswaId) {
      throw new Error('siswaId tidak boleh kosong');
    }

    if (now.isBefore(masuk)) {
      const presensi = await prisma.kehadiran.create({
        data: {
          tanggal: formatDate,
          wktdatang: formatTime,
          status: 'HADIR',
          siswaId: data.siswaId,
        },
        include: {
          siswa: true,
        },
      });
      return presensi;
    } else if (now.isBetween(masuk, belumPulang)) {
      const telat = await prisma.kehadiran.create({
        data: {
          tanggal: formatDate,
          wktdatang: formatTime,
          status: 'TELAT',
          siswaId: data.siswaId,
        },
        include: {
          siswa: true,
        },
      });
      return telat;
    } else if (now.isBetween(belumPulang, pulang)) {
      return { message: 'Belum waktunya pulang' };
    } else if (now.isAfter(pulang)) {
      const waktuPulang = await prisma.kehadiran.create({
        data: {
          tanggal: formatDate,
          wktpulang: formatTime,
          status: 'PULANG',
          siswaId: data.siswaId,
        },
        include: {
          siswa: true,
        },
      });

      return waktuPulang;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createKehadiran(body: { siswaId: number; status: string }) {
  try {
    const now = moment();
    const tanggal = now.toDate();

    const buat = await prisma.kehadiran.create({
      data: {
        tanggal: tanggal,
        wktdatang: null,
        wktpulang: null,
        status: body.status as Status,
        siswaId: body.siswaId,
      },
      include: {
        siswa: true,
      },
    });

    return buat;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type createUser = {
  nip?: number;
  email?: string;
  password: string;
  siswaId?: number;
  kelasId: number;
};

export async function createUser(body: createUser) {
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
      },
      include: { siswa: true },
    });
    return user;
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

type kelas = Omit<Kelas, 'id'>;

export async function createKelas(body: kelas) {
  try {
    const kelas = await prisma.kelas.create({
      data: body,
    });
    if (kelas) {
      return { message: 'Berhasil membuat kelas', kelas };
    } else {
      return { message: 'Gagal membuat kelas' };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

enum Status {
  HADIR = 'HADIR',
  IZIN = 'IZIN',
  ALPHA = 'ALPHA',
  TELAT = 'TELAT',
  PULANG = 'PULANG',
}

export async function groupByKeterangan(status: string, tanggal: Date) {
  try {
    const validStatus = status as Status;

    const awalHari = moment(tanggal).startOf('day').toDate();
    const akhirHari = moment(tanggal).endOf('day').toDate();

    const statusSiswa = await prisma.kehadiran.findMany({
      where: {
        status: validStatus,
        tanggal: {
          gte: awalHari,
          lte: akhirHari,
        },
      },
      include: {
        siswa: true,
      },
    });

    if (!statusSiswa || statusSiswa.length === 0) {
      return { message: `Tidak ada siswa yang berstatus '${validStatus}' pada tanggal ${tanggal.toLocaleString()}` };
    }

    return statusSiswa;
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

type inputSiswa = Omit<Siswa, 'id'>;

export async function createSiswa(options: inputSiswa) {
  try {
    const siswa = await prisma.siswa.create({
      data: options,
      include: {
        kelas: true,
      },
    });
    return siswa;
  } catch {
    console.error(Error);
  }
}

export async function countIzin(id: number, tahun: number, bulan: number) {
  try {
    const siswaId = id;
    const findSiswa = await prisma.kehadiran.findFirst({
      where: { siswaId: siswaId },
    });

    if (!findSiswa) {
      return { message: 'siswa tidak ditemukan' };
    }

    const awalTanggal = new Date(tahun, bulan - 1, 1);
    const akhirTanggal = new Date(tahun, bulan, 0);

    const countIzin = await prisma.kehadiran.count({
      where: {
        siswaId: siswaId,
        status: 'IZIN',
        tanggal: {
          gte: awalTanggal,
          lte: akhirTanggal,
        },
      },
    });

    return countIzin;
  } catch (error) {
    console.error(error);
    throw error;
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
        kelas: true,
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
