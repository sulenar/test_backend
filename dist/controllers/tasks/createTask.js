"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = void 0;
const db_1 = require("../../db/db");
const schemes_1 = require("../../validation/schemes");
const createTask = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { login } = ctx.state;
    const { userName, listName, taskDescription } = ctx.request
        .body;
    const badData = (0, schemes_1.validObject)(ctx.request.body);
    if (badData) {
        ctx.status = 406;
        ctx.body = badData;
        return;
    }
    const taskId = yield db_1.db.lists
        .findFirst({
        where: {
            list_name: listName,
            users: { login: userName },
            OR: [{ list_rule: { allowed_to_create: true } }, { users: { login } }],
        },
    })
        .then((result) => {
        return result === null || result === void 0 ? void 0 : result.id;
    })
        .catch(() => {
        return undefined;
    });
    if (!taskId) {
        yield db_1.db.$disconnect();
        ctx.throw(400, 'Incorrect listName parameter');
    }
    yield db_1.db.tasks
        .create({
        data: { task_description: taskDescription, task_id: taskId },
    })
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.body = `task for listName ${listName} created`;
    }))
        .catch(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.status = 400;
        ctx.body = `creating failed`;
    }));
});
exports.createTask = createTask;
//# sourceMappingURL=createTask.js.map