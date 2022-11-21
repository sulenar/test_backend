import koa from 'koa';
import koaBody from 'koa-body';
import listsRouter from './routes/listsRourer';
import taskRouter from './routes/tasksRouter';
import userRouter from './routes/userRouter';

const app = new koa();

app.use(koaBody());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(listsRouter.routes());
app.use(listsRouter.allowedMethods());
app.use(taskRouter.routes());
app.use(taskRouter.allowedMethods());

export { app };
