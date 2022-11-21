"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const controllers_1 = require("../controllers");
const userController_1 = require("../controllers/user/userController");
const listsRouter = new koa_router_1.default().prefix('/api/list');
listsRouter.post('/', userController_1.userController.login, controllers_1.createList);
listsRouter.get('/', userController_1.userController.login, controllers_1.readList);
listsRouter.get('/all/:userName', userController_1.userController.login, controllers_1.readAllLists);
listsRouter.delete('/:listName', userController_1.userController.login, controllers_1.deleteList);
listsRouter.put('/rules/update', userController_1.userController.login, controllers_1.changeRule);
exports.default = listsRouter;
//# sourceMappingURL=listsRourer.js.map