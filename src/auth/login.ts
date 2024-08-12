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
      const { email, password } = body;
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        set.status = 403;
        return { message: 'Email tidak di temukan' };
      }

      if (email != user.email) {
        set.status = 403;
        return { message: 'Email anda salah' };
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        set.status = 403;
        return { message: 'Password anda salah' };
      }

      const accessToken = await jwtAccess.sign({
        id: String(user.id),
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { token: accessToken },
      });

      return { message: 'berhasil login', token: accessToken };
    },
    {
      body: 'basicAuthModel',
    }
  );
