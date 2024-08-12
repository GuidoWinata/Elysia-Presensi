import { Elysia, t } from 'elysia';
import { kehadiran } from '../db/data';
import { masukPresensi, createSiswa, getAllSiswa, findSiswa, deleteKehadiran, getAllKehadiran, updateKehadiran, pulangPresensi, createKelas, createUser } from '../handler/handler';
import { Kehadiran } from '@prisma/client';

const presensiSC = t.Object({
  siswaId: t.Number(),
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
  .post('user/', ({ body }) => createUser(body), {
    body: t.Object({
      email: t.String(),
      password: t.String(),
      siswaId: t.Optional(t.Number()),
      kelasId: t.Number(),
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
      nisn: t.Number(),
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
  .delete('kehadiran/:id', ({ params: { id } }) => deleteKehadiran(id), {
    params: t.Object({
      id: t.Number(),
    }),
  });

export default router;
