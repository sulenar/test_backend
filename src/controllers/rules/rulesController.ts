import { db } from '../../db/db';
import { koaCTX, newRule, reqBodyRule } from '../../types/types';
import { validBodyRule } from '../../validation/schemes';

export const changeRule = async (ctx: koaCTX) => {
  const { login } = ctx.state as { login: string };
  const {
    listName,
    rule: { name, value },
  } = ctx.request.body as reqBodyRule;

  const badData = validBodyRule(ctx.request.body);

  if (badData) {
    ctx.status = 406;
    ctx.body = badData;
    return;
  }

  const rule: newRule = {
    [name]: value,
  };

  await db.rules
    .updateMany({
      where: { lists: { list_name: listName, users: { login } } },
      data: rule,
    })
    .then(async (res) => {
      await db.$disconnect();
      if (res.count) {
        ctx.body = 'Rules updated successfully';
        return;
      }
      ctx.status = 403;
      ctx.body =
        'You cannot change the rules of this list or list does not exist';
    })
    .catch(async (e) => {
      await db.$disconnect();
      ctx.status = 400;
      ctx.body = `rule change failed`;
    });
};
