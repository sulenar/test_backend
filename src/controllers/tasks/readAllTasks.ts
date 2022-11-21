import { db } from '../../db/db';
import { koaCTX } from '../../types/types';
import { validObject } from '../../validation/schemes';

export const readAllTasks = async (ctx: koaCTX) => {
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

  await db.tasks
    .findMany({
      where: {
        lists: { users: { login: userName }, list_name: listName },
        OR: [
          { lists: { list_rule: { allowed_to_read: true } } },
          { lists: { users: { login } } },
        ],
      },
    })
    .then(async (res) => {
      await db.$disconnect();
      if (!res.length) {
        ctx.body = 'tasks not found';
        ctx.status = 404;
      }
      ctx.body = res;
    })
    .catch(async () => {
      await db.$disconnect();
      ctx.status = 400;
      ctx.body = `tasks search failed`;
    });
};
