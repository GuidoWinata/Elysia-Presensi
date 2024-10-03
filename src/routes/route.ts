import { Elysia, t } from 'elysia';
import { masukPresensi, createSiswa, getAllSiswa, findSiswa, deleteKehadiran, getAllKehadiran, updateKehadiran, pulangPresensi, createKelas, createUser, countIzin, createKehadiran, groupByKeterangan, createGuru, getAllKelas } from '../handler/handler';
import { Kehadiran } from '@prisma/client';
import prisma from '../db/client';

const presensiSC = t.Object({
  siswaId: t.Number(),
});

const StatusEnum = t.Enum({
  HADIR: 'HADIR',
  IZIN: 'IZIN',
  ALPHA: 'ALPHA',
  TELAT: 'TELAT',
  PULANG: 'PULANG',
});

const router = new Elysia({ prefix: '/api' })
  .post(
    '/kehadiran',
    async ({ body }: { body: Kehadiran }) => {
      try {
        const presensi = await masukPresensi(body);
        console.log(presensi);
        return presensi;
      } catch (error) {
        console.error('Error:', error);
        return { error: 'Gagal membuat presensi' };
      }
    },
    {
      body: presensiSC,
    }
  )
  .post('/guru', async ({ body }) => createGuru(body), {
    body: t.Object({
      nama: t.String(),
      nip: t.String(),
      kelasId: t.Numeric(),
    }),
  })
  .post('/siswa/kehadiran', async ({ body }) => createKehadiran(body), {
    body: t.Object({
      siswaId: t.Number(),
      status: StatusEnum,
    }),
  })
  .post('user/', ({ body }) => createUser(body), {
    body: t.Object({
      password: t.String(),
      siswaId: t.Optional(t.Number()),
      guruId: t.Optional(t.Number()),
    }),
  })
  .post('kelas/', ({ body }) => createKelas(body), {
    body: t.Object({
      nama: t.String(),
    }),
  })
  .patch('pulang/:id', async ({ params: { id } }) => {
    try {
      const pulang = await pulangPresensi(Number(id));
      return pulang;
    } catch (error) {
      console.error('Error:', error);
      return { error: 'Gagal mengupdate presensi' };
    }
  })
  .get('siswa/:id', ({ params: { id } }) => findSiswa(id), {
    params: t.Object({
      id: t.Number(),
    }),
  })
  .post('/siswa', ({ body }) => createSiswa(body), {
    body: t.Object({
      nisn: t.String(),
      nama: t.String(),
      kelasId: t.Number(),
    }),
  })
  .patch('kehadiran/:id', async ({ params, body }: { params: { id: number }; body: Kehadiran }) => {
    try {
      const updatepresen = await updateKehadiran(params.id, body);
      return updatepresen;
    } catch (error) {
      console.error('Error update presensi:', error);
      return { error: 'gagal update presensi' };
    }
  })
  .get('/siswa', () => getAllSiswa())
  .get('/kehadiran', () => getAllKehadiran())
  .get(
    '/kehadiran/status',
    async ({ query }) => {
      const { status, tanggal } = query;

      const parsedTanggal = new Date(tanggal);

      console.log('status:', status);
      console.log('tanggal:', parsedTanggal);

      return await groupByKeterangan(status, parsedTanggal);
    },
    {
      query: t.Object({
        status: StatusEnum,
        tanggal: t.String(),
      }),
    }
  )
  .get('/kelas', () => getAllKelas())
  .get('/kehadiran/:siswaId', async (req) => {
    const siswaId = parseInt(req.params.siswaId);

    const cekKehadiran = await prisma.kehadiran.findFirst({
      where: {
        siswaId: siswaId,
        status: 'IZIN',
      },
    });

    if (!cekKehadiran) {
      return { message: `Siswa tidak memiliki status izin pada bulan ${req.query.bulan} - ${req.query.tahun}` };
    }

    const bulan = req.query.bulan!;
    const tahun = req.query.tahun!;

    const startDate = new Date(parseInt(tahun), parseInt(bulan) - 1, 1);
    const endDate = new Date(parseInt(tahun), parseInt(bulan), 0);

    const jumlahIzin = await prisma.kehadiran.count({
      where: {
        siswaId: siswaId,
        status: 'IZIN',
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return jumlahIzin;
  })
  .delete('kehadiran/:id', ({ params: { id } }) => deleteKehadiran(id), {
    params: t.Object({
      id: t.Number(),
    }),
  });

export default router;
