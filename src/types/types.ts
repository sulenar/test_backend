import koa from 'koa';

export type koaCTX = koa.ParameterizedContext<
  koa.DefaultState,
  koa.DefaultContext,
  any
>;

export type Next = koa.Next;

export interface registrationBody {
  login: string;
  password: string;
}

export interface newRule {
  [key: string]: boolean;
}

export interface newTaskBody {
  userName: string;
  listName: string;
  taskDescription: string;
}

export interface reqBodyRule {
  listName: string;
  rule: { name: string; value: boolean };
}
