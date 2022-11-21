import { db } from '../../db/db';
import { koaCTX } from '../../types/types';
import { validRequiredString } from '../../validation/schemes';

export const readAllLists = async (ctx: koaCTX) => {
  const { login } = ctx.state as { login: string };
  const { userName } = ctx.params as { userName: string };

  const badValue = validRequiredString(userName, 'userName');

  if (badValue) {
    ctx.status = 406;
    ctx.body = badValue;
    return;
  }

  await db.lists
    .findMany({
      where: {
        users: { login: userName },
        OR: [
          {
            OR: [
              { list_rule: { allowed_to_read: true } },
              { list_rule: { allowed_to_create: true } },
              { list_rule: { allowed_to_update: true } },
              { list_rule: { allowed_to_delete: true } },
            ],
          },
          { users: { login } },
        ],
      },
    })
    .then(async (res) => {
      await db.$disconnect();

      if (!res.length) ctx.status = 404;
      ctx.body = res;
    })
    .catch(async (e) => {
      await db.$disconnect();
      ctx.status = 400;
      ctx.body = `lists lookup failed`;
    });
};
