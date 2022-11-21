import Router from 'koa-router';
import { userController } from '../controllers/user/userController';

const userRouter = new Router().prefix('/api');

userRouter.post('/registration', userController.registration);
userRouter.post('/login', userController.login, (ctx) => {
  ctx.body = 'authorization complete';
});

export default userRouter;
