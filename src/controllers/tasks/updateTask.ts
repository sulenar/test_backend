import { db } from '../../db/db';
import { koaCTX } from '../../types/types';
import { validObject } from '../../validation/schemes';

export const updateTask = async (ctx: koaCTX) => {
  const { id, userName, listName, taskDescription } = ctx.request.body as {
    id: number;
    userName: string;
    listName: string;
    taskDescription: string;
  };
  const { login } = ctx.state as { login: string };

  const badData = validObject(ctx.request.body);

  if (badData) {
    ctx.status = 406;
    ctx.body = badData;
    return;
  }

  await db.tasks
    .updateMany({
      where: {
        id,
        lists: { users: { login: userName }, list_name: listName },
        OR: [
          { lists: { list_rule: { allowed_to_update: true } } },
          { lists: { users: { login } } },
        ],
      },
      data: {
        task_description: taskDescription,
      },
    })
    .then(async () => {
      await db.$disconnect();
      ctx.body = 'Task updated';
    })
    .catch(async () => {
      await db.$disconnect();
      ctx.status = 400;
      ctx.body = `task update failed`;
    });
};
