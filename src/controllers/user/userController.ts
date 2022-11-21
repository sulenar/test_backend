import { db } from '../../db/db';
import md5 from 'crypto-js/md5';
import { koaCTX, Next, registrationBody } from '../../types/types';
import { validObject } from '../../validation/schemes';

class User {
  async registration(ctx: koaCTX): Promise<void> {
    const { login, password } = ctx.request.body as registrationBody;

    const wrongData = validObject({ login, password });

    if (wrongData) {
      ctx.status = 406;
      ctx.body = wrongData;
      return;
    }

    await db.users
      .create({
        data: {
          login,
          hashed_password: md5(password).toString(),
        },
      })
      .then(async () => {
        await db.$disconnect();
        ctx.body = `user ${login} created`;
      })
      .catch(async (e) => {
        await db.$disconnect();
        ctx.throw(400, `user ${login} already exists`);
      });
  }

  async login(ctx: koaCTX, next: Next): Promise<Next | void> {
    const { authorization } = ctx.request.header;
    let logAndPass: string = '';

    if (authorization && /Basic \w+/.test(authorization)) {
      const [, hash] = authorization.split(' ');
      const decryptedHash = Buffer.from(hash, 'base64').toString();

      if (/\w+:\w+/.test(decryptedHash)) logAndPass = decryptedHash;
    }

    if (!logAndPass) ctx.throw(401);

    const [login, password] = logAndPass.split(':');

    await db.users
      .findFirst({
        where: {
          AND: {
            login: { equals: login },
            hashed_password: md5(password).toString(),
          },
        },
      })
      .then(async (user) => {
        if (user) {
          ctx.state.id = user.id;
          ctx.state.login = user.login;
          await next();
          return;
        }
        ctx.status = 401;
      })
      .catch(async (e) => {
        await db.$disconnect();
        ctx.status = 400;
        ctx.body = 'Authorization failed';
      });
  }
}

export const userController = new User();
