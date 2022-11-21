import { db } from '../../db/db';
import { koaCTX } from '../../types/types';
import { validObject } from '../../validation/schemes';

export const readList = async (ctx: koaCTX) => {
  const { listName, userName } = ctx.query as {
    listName: string;
    userName: string;
  };
  const { login } = ctx.state as { login: string };
  const badData = validObject({ listName, userName });

  if (badData) {
    ctx.status = 406;
    ctx.body = badData;
    return;
  }

  await db.lists
    .findFirst({
      where: {
        list_name: listName,
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
      if (!res) {
        ctx.status = 404;
        ctx.body = 'List not found';
        return;
      }
      ctx.body = res;
    })
    .catch(async () => {
      await db.$disconnect();
      ctx.status = 400;
      ctx.body = `list lookup failed`;
    });
};
