import { Elysia } from 'elysia';
import prisma from '../db/client';
import bcrypt from 'bcrypt';
import { jwtAccessSetup, authModel } from './setup';

export const login = new Elysia()
  .use(authModel)
  .use(jwtAccessSetup)
  .post(
    '/api/login',
    async function handler({ body, set, jwtAccess }) {
      const { nisn, nip, password } = body;

      let siswa;
      let user;

      if (nisn) {
        siswa = await prisma.siswa.findUnique({
          where: { nisn: nisn },
          include: { user: true },
        });

        if (!siswa) {
          set.status = 403;
          return { message: 'NISN tidak ditemukan' };
        }

        user = await prisma.user.findUnique({
          where: { id: siswa.id },
        });

        if (!user) {
          set.status = 403;
          return { message: 'Siswa tidak ditemukan' };
        }
      } else if (nip) {
        user = await prisma.user.findUnique({
          where: { nip: nip },
        });

        if (!user) {
          set.status = 403;
          return { message: 'NIP tidak ditemukan' };
        }
      } else {
        set.status = 400;
        return { message: 'NISN atau NIP harus diisi' };
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        set.status = 403;
        return { message: 'Data yang anda masukkan salah' };
      }

      const accessToken = await jwtAccess.sign({
        id: String(user.id),
      });

      const login = await prisma.user.update({
        where: { id: user.id },
        data: { token: accessToken },
        include: {
          siswa: true,
        },
      });

      return login;
    },
    {
      body: 'basicAuthModel',
    }
  );
