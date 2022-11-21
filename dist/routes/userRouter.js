"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const userController_1 = require("../controllers/user/userController");
const userRouter = new koa_router_1.default().prefix('/api');
userRouter.post('/registration', userController_1.userController.registration);
userRouter.post('/login', userController_1.userController.login, (ctx) => {
    ctx.body = 'authorization complete';
});
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map