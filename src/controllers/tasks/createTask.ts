import { db } from '../../db/db';
import { koaCTX, newTaskBody } from '../../types/types';
import { validObject } from '../../validation/schemes';

export const createTask = async (ctx: koaCTX) => {
  const { login } = ctx.state as { login: string };
  const { userName, listName, taskDescription } = ctx.request
    .body as newTaskBody;

  const badData = validObject(ctx.request.body);

  if (badData) {
    ctx.status = 406;
    ctx.body = badData;
    return;
  }

  const taskId = await db.lists
    .findFirst({
      where: {
        list_name: listName,
        users: { login: userName },
        OR: [{ list_rule: { allowed_to_create: true } }, { users: { login } }],
      },
    })
    .then((result) => {
      return result?.id;
    })
    .catch(() => {
      return undefined;
    });

  if (!taskId) {
    await db.$disconnect();
    ctx.throw(400, 'Incorrect listName parameter');
  }

  await db.tasks
    .create({
      data: { task_description: taskDescription, task_id: taskId },
    })
    .then(async () => {
      await db.$disconnect();
      ctx.body = `task for listName ${listName} created`;
    })
    .catch(async () => {
      await db.$disconnect();
      ctx.status = 400;
      ctx.body = `creating failed`;
    });
};
