import { Elysia } from 'elysia';
import cors from '@elysiajs/cors';
import router from './routes/route';
import { login } from './auth/login';

const app = new Elysia();

app
  .use(router)
  .use(login)
  .use(
    cors({
      origin: 'http://localhost:5173',
    })
  )
  .listen(3000, () => {
    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
  });
