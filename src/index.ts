import { Elysia } from 'elysia';
import router from './routes/route';
import { login } from './auth/login';

const app = new Elysia();

app
  .use(router)
  .use(login)
  .listen(3000, () => {
    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
  });
