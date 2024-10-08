import { jwt } from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';
import { nanoid } from 'nanoid';

export const authModel = new Elysia().model({
  basicAuthModel: t.Object({
    identifier: t.Optional(t.String()),
    password: t.String(),
  }),
});

export const jwtAccessSetup = new Elysia().use(
  jwt({
    name: 'jwtAccess',
    schema: t.Object({
      id: t.String(),
    }),
    secret: nanoid(),
    exp: '1h',
  })
);
