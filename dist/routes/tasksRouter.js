"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const userController_1 = require("../controllers/user/userController");
const controllers_1 = require("../controllers");
const taskRouter = new koa_router_1.default().prefix('/api/task');
taskRouter.post('/', userController_1.userController.login, controllers_1.createTask);
taskRouter.get('/', userController_1.userController.login, controllers_1.readTask);
taskRouter.get('/all', userController_1.userController.login, controllers_1.readAllTasks);
taskRouter.put('/', userController_1.userController.login, controllers_1.updateTask);
taskRouter.delete('/', userController_1.userController.login, controllers_1.deleteTask);
exports.default = taskRouter;
//# sourceMappingURL=tasksRouter.js.map