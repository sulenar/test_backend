import { db } from '../../db/db';
import { koaCTX, newTaskBody } from '../../types/types';
import { validObject } from '../../validation/schemes';

export const readTask = async (ctx: koaCTX) => {
  const { taskId, userName, listName } = ctx.query as {
    taskId: string;
    userName: string;
    listName: string;
  };
  const { login } = ctx.state as { login: string };

  const badData = validObject({ taskId, userName, listName });

  if (badData) {
    ctx.status = 406;
    ctx.body = badData;
    return;
  }

  await db.tasks
    .findFirst({
      where: {
        id: +taskId,
        lists: { users: { login: userName }, list_name: listName },
        OR: [
          { lists: { list_rule: { allowed_to_read: true } } },
          { lists: { users: { login } } },
        ],
      },
    })
    .then(async (res) => {
      await db.$disconnect();
      if (!res) {
        ctx.status = 404;
        ctx.body = 'task not found';
        return;
      }
      ctx.body = res;
    })
    .catch(async () => {
      await db.$disconnect();
      ctx.status = 400;
      ctx.body = `task search failed`;
    });
};
