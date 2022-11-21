import Router from 'koa-router';
import { userController } from '../controllers/user/userController';
import {
  createTask,
  deleteTask,
  readAllTasks,
  readTask,
  updateTask,
} from '../controllers';

const taskRouter = new Router().prefix('/api/task');

taskRouter.post('/', userController.login, createTask);
taskRouter.get('/', userController.login, readTask);
taskRouter.get('/all', userController.login, readAllTasks);
taskRouter.put('/', userController.login, updateTask);
taskRouter.delete('/', userController.login, deleteTask);

export default taskRouter;
