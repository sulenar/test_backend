import { db } from '../../db/db';
import { koaCTX } from '../../types/types';
import { validObject } from '../../validation/schemes';

export const deleteTask = async (ctx: koaCTX) => {
  const { id, userName, listName } = ctx.query as {
    id: string;
    userName: string;
    listName: string;
  };
  const { login } = ctx.state as { login: string };

  const badData = validObject({ id, userName, listName });

  if (badData) {
    ctx.status = 406;
    ctx.body = badData;
    return;
  }

  await db.tasks
    .deleteMany({
      where: {
        id: +id,
        lists: { users: { login: userName }, list_name: listName },
        OR: [
          { lists: { list_rule: { allowed_to_delete: true } } },
          { lists: { users: { login } } },
        ],
      },
    })
    .then(async () => {
      await db.$disconnect();
      ctx.body = 'Task deleted';
    })
    .catch(async () => {
      await db.$disconnect();
      ctx.status = 400;
      ctx.body = `task update failed`;
    });
};
