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
      const { identifier, password } = body;

      let user;

      if (identifier?.length === 10) {
        const siswa = await prisma.siswa.findUnique({
          where: { nisn: identifier },
          include: { user: true },
        });

        if (!siswa) {
          set.status = 403;
          return { message: 'NISN tidak ditemukan' };
        }

        user = siswa.user;

        if (!user) {
          set.status = 403;
          return { message: 'User tidak menggunakan NISN' };
        }

        user = await prisma.user.findUnique({
          where: { id: siswa.id },
        });

        if (!user) {
          set.status = 403;
          return { message: 'Siswa tidak ditemukan' };
        }
      } else {
        const guru = await prisma.guru.findUnique({
          where: { nip: identifier },
        });

        if (!guru) {
          set.status = 403;
          return { message: 'NIP tidak ditemukan' };
        }

        user = await prisma.user.findUnique({
          where: { id: guru.id },
        });

        if (!user) {
          set.status = 403;
          return { message: 'Guru tidak ditemukan' };
        }
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
