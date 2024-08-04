import { Elysia } from 'elysia';
import router from './routes/route';

const app = new Elysia();

app.use(router).listen(3000, () => {
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
});
