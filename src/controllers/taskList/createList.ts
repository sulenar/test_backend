import { db } from '../../db/db';
import { koaCTX } from '../../types/types';
import { validRequiredString } from '../../validation/schemes';

export const createList = async (ctx: koaCTX) => {
  const { listName } = ctx.request.body as { listName: string };

  const badValue = validRequiredString(listName, 'listName');

  if (badValue) {
    ctx.status = 406;
    ctx.body = badValue;
    return;
  }

  const alreadyExsists = await db.lists
    .findFirst({
      where: {
        list_name: listName,
        user_id: ctx.state.id,
      },
    })
    .then((res) => res)
    .catch(async () => {
      return null;
    });

  if (alreadyExsists) {
    await db.$disconnect();
    ctx.status = 400;
    ctx.body = `list ${listName} already exists for this user`;
    return;
  }

  await db.lists
    .create({
      data: {
        list_name: listName,
        user_id: ctx.state.id,
        list_rule: {
          create: {
            allowed_to_create: false,
            allowed_to_read: false,
            allowed_to_update: false,
            allowed_to_delete: false,
          },
        },
      },
    })
    .then(async () => {
      await db.$disconnect();
      ctx.body = `taskList ${listName} created`;
    })
    .catch(async (e) => {
      await db.$disconnect();
      ctx.status = 400;
      ctx.body = `creating list failed`;
    });
};
