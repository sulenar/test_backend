"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const listsRourer_1 = __importDefault(require("./routes/listsRourer"));
const tasksRouter_1 = __importDefault(require("./routes/tasksRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const app = new koa_1.default();
exports.app = app;
app.use((0, koa_body_1.default)());
app.use(userRouter_1.default.routes());
app.use(userRouter_1.default.allowedMethods());
app.use(listsRourer_1.default.routes());
app.use(listsRourer_1.default.allowedMethods());
app.use(tasksRouter_1.default.routes());
app.use(tasksRouter_1.default.allowedMethods());
//# sourceMappingURL=index.js.map