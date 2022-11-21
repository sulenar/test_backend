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
exports.readTask = void 0;
const db_1 = require("../../db/db");
const schemes_1 = require("../../validation/schemes");
const readTask = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId, userName, listName } = ctx.query;
    const { login } = ctx.state;
    const badData = (0, schemes_1.validObject)({ taskId, userName, listName });
    if (badData) {
        ctx.status = 406;
        ctx.body = badData;
        return;
    }
    yield db_1.db.tasks
        .findFirst({
        where: {
            id: +taskId,
            lists: { users: { login: userName }, list_name: listName },
            OR: [
                { lists: { list_rule: { allowed_to_read: true } } },
                { lists: { users: { login } } },
            ],
        },
    })
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        if (!res) {
            ctx.status = 404;
            ctx.body = 'task not found';
            return;
        }
        ctx.body = res;
    }))
        .catch(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.$disconnect();
        ctx.status = 400;
        ctx.body = `task search failed`;
    }));
});
exports.readTask = readTask;
//# sourceMappingURL=readTask.js.map