import { db } from '../../db/db';
import { koaCTX } from '../../types/types';
import { validRequiredString } from '../../validation/schemes';

export const deleteList = async (ctx: koaCTX) => {
  const { login } = ctx.state as { login: string };
  const { listName } = ctx.params as { listName: string };

  const badValue = validRequiredString(listName, 'listName');

  if (badValue) {
    ctx.status = 406;
    ctx.body = badValue;
    return;
  }

  const deleteTasks = db.tasks.deleteMany({
    where: { lists: { list_name: listName, users: { login } } },
  });

  const deleteRules = db.rules.deleteMany({
    where: { lists: { list_name: listName, users: { login } } },
  });

  const deleteList = db.lists.deleteMany({
    where: { list_name: listName, users: { login } },
  });

  await db
    .$transaction([deleteTasks, deleteRules, deleteList])
    .then(async (res) => {
      await db.$disconnect();
      ctx.body = res;
    })
    .catch(async (e) => {
      await db.$disconnect();
      ctx.status = 400;
      ctx.body = `deleting failed`;
    });
};
