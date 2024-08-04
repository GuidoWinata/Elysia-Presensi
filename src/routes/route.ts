import { Elysia, t } from 'elysia';
import { kehadiran } from '../db/data';
import { createPresensi, createSiswa, getAllSiswa, findSiswa, deleteKehadiran, getAllKehadiran, updateKehadiran } from '../handler/handler';

const presensiSC = t.Object({
  siswaId: t.Number(),
});

const router = new Elysia({ prefix: '/api' })
  .post(
    '/kehadiran',
    async ({ body }: { body: Partial<kehadiran> }) => {
      try {
        const presensi = await createPresensi(body);
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
  .get('siswa/:id', ({ params: { id } }) => findSiswa(id), {
    params: t.Object({
      id: t.Number(),
    }),
  })
  .post('/siswa', ({ body }) => createSiswa(body), {
    body: t.Object({
      nisn: t.Number(),
      nama: t.String(),
      kelas: t.String(),
    }),
  })
  .patch('kehadiran/:id', ({ params: { id }, body }) => updateKehadiran(id, body), {
    params: t.Object({
      id: t.Number(),
    }),
    body: t.Object({
      tanggal: t.String(),
      wktdatang: t.Date(),
      wktpulang: t.Date(),
      siswaId: t.Number(),
    }),
  })
  .get('/siswa', () => getAllSiswa())
  .get('/kehadiran', () => getAllKehadiran())
  .delete('kehadiran/:id', ({ params: { id } }) => deleteKehadiran(id), {
    params: t.Object({
      id: t.Number(),
    }),
  });

export default router;
