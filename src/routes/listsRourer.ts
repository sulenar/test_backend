import Router from 'koa-router';
import {
  createList,
  readList,
  readAllLists,
  deleteList,
  changeRule,
} from '../controllers';
import { userController } from '../controllers/user/userController';

const listsRouter = new Router().prefix('/api/list');

listsRouter.post('/', userController.login, createList);
listsRouter.get('/', userController.login, readList);
listsRouter.get('/all/:userName', userController.login, readAllLists);
listsRouter.delete('/:listName', userController.login, deleteList);
listsRouter.put('/rules/update', userController.login, changeRule);

export default listsRouter;
